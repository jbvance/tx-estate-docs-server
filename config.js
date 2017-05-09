let secret;

if (!process.env.NODE_ENV){
  require('dotenv').config();
}

module.exports = {
  SECRET: process.env.SECRET,
  DB_CONNECT_STRING: process.env.DB_CONNECT_STRING
};
