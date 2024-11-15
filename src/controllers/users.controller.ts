import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import User from '../models/user.js'
import { getCommunicationToken, validateUser } from '../helpers/helper.js'

dotenv.config();
class UserController {
  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userName, password } = req.body;
      if (![userName, password].every(Boolean)) {
        return res.status(400).send({
          message: locals.login_credential_require,
          success: false,
          data: null
        });
      }
      const user = await User.findOne({
        where: { userName },
      });

      if (!user || !user.password) {
        return res.status(404).send({
          success: false,
          message: locals.user_not_found,
          data: null
        });
      }
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ id: user.id });
        const refreshToken = generateRefreshToken({ id: user.id });
        let data = await getCommunicationToken();
        console.error('data:', data?.token);
        let communicationUserId = data?.userId
        let communicationUserToken = data?.token
        await User.update({ communicationUserId, communicationUserToken }, {
          where: { id: user.id },
        });
        const result = await User.findOne({
          where: { userName },
        });
        return res.status(200).send({
          success: true,
          message: locals.user_login,
          accessToken,
          refreshToken,
          data: result
        });
      } else {
        return res.status(400).send({
          success: false,
          message: locals.invalid_user_credential,
          data: null
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: locals.error_occurred,
        data: null
      });
    }
  }

  //for fetch user by token 
  public async fetchUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData = await validateUser(req, res);
      return res.status(200).send({
        success: true,
        message: locals.invalid_user_credential,
        data: userData
      });
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: locals.error_occurred,
        data: null
      });
    }
  }

  //for update user by token 
  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData = await validateUser(req, res);
      const user = await User.update(req.body, {
        where: { id: userData?.id },
      });
      return res.status(200).send({
        success: true,
        message: locals.invalid_user_credential,
        data: userData
      });
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: locals.error_occurred,
        data: null
      });
    }
  }
}


// accessTokens
let accessTokens: any[] = [];
function generateAccessToken(user: object) {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', {
    expiresIn: "1y",
  });
  accessTokens.push(accessToken);
  return accessToken;
}

// refreshTokens
let refreshTokens: any[] = [];
function generateRefreshToken(user: object) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || '', {
    expiresIn: "2y",// token expiry time
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

export default new UserController();