import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Create a new instance of Sequelize with your MySQL database configuration
export const sequelize = new Sequelize(process.env.DB_NAME || "", process.env.DB_USER || "root", "", {
    host: process.env.DB_HOST || "",
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 5432
});


// Optionally, test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
