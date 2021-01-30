import dotenv from 'dotenv';
dotenv.config();

const
SERVER_URL   = "https://listiee-backend.herokuapp.com" || 'http://localhost:9000',
LOGIN_URL    = `${SERVER_URL}/user/login`,
SIGNUP_URL   = `${SERVER_URL}/user/signup`,
REFRESH_URL  = `${SERVER_URL}/user/refresh`,
POST_URL     = `${SERVER_URL}/post/create`,
ALL_POST_URL = `${SERVER_URL}/post/all`,
LOGOUT_URL   = `${SERVER_URL}/user/logout`;

export {
    SERVER_URL,
    LOGIN_URL,
    SIGNUP_URL,
    POST_URL,
    ALL_POST_URL,
    REFRESH_URL,
    LOGOUT_URL
};