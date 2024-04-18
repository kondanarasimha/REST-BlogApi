import pg from 'pg';


const db = new pg.Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
db.connect();

  const getUserData = async(userName)=> await db.query('SELECT * FROM users WHERE user_name = $1',[userName]);

  const checkUserName = async(userName) => await db.query('SELECT user_name FROM users WHERE user_name = $1',[userName]);

  const userMailCheck = async(mail) => await db.query('SELECT email FROM users WHERE email = $1',[mail]);

  const registerNewUser = async(userName,mail,hashedPassword,apiKey) => await db.query('INSERT INTO public.users(user_name,email,password,api_key)VALUES($1,$2,$3,$4)',[userName,mail,hashedPassword,apiKey]);

  const registerNewUserBygoogle = async(userName,mail,hashedPassword,apiKey,googleId) => await db.query('INSERT INTO public.users(user_name,email,password,api_key,google_id)VALUES($1,$2,$3,$4,$5)',[userName,mail,hashedPassword,apiKey,googleId]);

  const updatePassword = async(hashedPassword,gmail)=> await db.query('UPDATE users SET password = $1 WHERE email = $2',[hashedPassword,gmail]);

  const getUserNameByEmail = async(mail)=> await db.query('SELECT user_name FROM users WHERE email = $1',[mail]);

  const getGoogleIdbyEmail = async(email)=> await db.query("SELECT google_id FROM users where email = $1",[email]);

  const getApiKeyBymail = async(email)=> await db.query('SELECT api_key FROM users WHERE email = $1',[email]);

  
  export { checkUserName, userMailCheck, registerNewUser, getUserData, updatePassword, getUserNameByEmail,getGoogleIdbyEmail, getApiKeyBymail, registerNewUserBygoogle }

