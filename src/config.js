require('dotenv').config();

const URL_NAME = process.env.URL_NAME;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

module.exports = {
    URL_NAME,
    PORT,
    JWT_SECRET,
    EMAIL_ADDRESS,
    EMAIL_PASSWORD
}