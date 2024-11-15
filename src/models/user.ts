import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js'; // Your sequelize instance

// Define User attributes interface
interface UserAttributes {
  id: number;
  fullName: string;
  userName: string;
  password: string;
  role: string;
  status: string;
  deletedAt?: Date | null;
  isAvailable: boolean;
  socketId: string;
  communicationUserId: string;
  communicationUserToken: string;
}

// Optional attributes during model creation (e.g., 'id' and 'deletedAt' can be optional)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'deletedAt'> { }

// User model definition
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public userName!: string;
  public password!: string;
  public role!: string;
  public status!: string;
  public isAvailable!: boolean;
  public deletedAt!: Date | null;
  public socketId!: string;
  public communicationUserId!: string;
  public communicationUserToken!: string;
  // Optional timestamps for sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["customer", "interpreter", ""],
      defaultValue: "customer"
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive", ""],
      defaultValue: "active"
    },
    socketId: {
      type: DataTypes.STRING
    },
    communicationUserId: {
      type: DataTypes.STRING
    },
    communicationUserToken: {
      type: DataTypes.TEXT
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: 'User', // Correct model name capitalization (use PascalCase here)
    paranoid: true, // Enables soft deletes with 'deletedAt'
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model (either default or named export, depending on your preference)
export default User;
