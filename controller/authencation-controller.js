import ejs from 'ejs';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {otpSending,sentGmail,userNameSending} from '../services/mailing-service.js';
import { otp } from './utils.js';
import { passwordBcrypt,passwordCheck } from './bcrypt-utils.js';
import { checkUserName, userMailCheck, registerNewUser, getUserData, updatePassword, getUserNameByEmail, getApiKeyBymail, registerNewUserBygoogle, getGoogleIdbyEmail } from '../models/users.js';


import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";



const signup = async(req,res) => {
  res.render('signup-page.ejs');
}

const createUser = async(req,res) => {
 try {
    const newUser = req.body;
    const nameCheck = await checkUserName(newUser.username);
    const mailCheck = await userMailCheck(newUser.email);
    if (nameCheck.rowCount > 0 && mailCheck.rowCount > 0) {
      res.render('signup-page.ejs', { message: 'Username and email already exists'});
    } else if(nameCheck.rowCount > 0) {
      res.render('signup-page.ejs',{message: 'Username already exists'});
    } else if(mailCheck.rowCount > 0) {
      console.log(mailCheck.rowCount > 0);
      res.render('signup-page.ejs',{message: 'Email already exists'});
    } else {
      const hashedPassword = passwordBcrypt(newUser.password);
      const apiKey = uuidv4();
      const userRegister = await registerNewUser(newUser.username, newUser.email, hashedPassword, apiKey);
      if(userRegister.rowCount > 0) {
        res.render('signup-successful.ejs');
      } else {
        res.render('signup-failed.ejs');
      }
    }
  } catch (err) {
      console.log(err);
      res.render('404-page.ejs');
    }
} 

const login = async(req,res)=> {
  try {
    res.render('login-page.ejs');
  } catch(err) {
    res.render('404-page.ejs');
    console.log(err);
  }
}


const loginCredentials = async(req,res) => {
  try {
  const userReq = req.body;
  const user = await getUserData(userReq.username);
  if(user.rowCount > 0) {
    const hashedPassword = user.rows[0].password;
    const userName = user.rows[0].user_name;
    const result = passwordCheck(userReq.password, hashedPassword); 
      if(result) {
      const userApiKey = user.rows[0].api_key;
      res.render('api-key.ejs',{apiKey:userApiKey});
      } else {
        res.render('login-page.ejs',{message: 'Please Enter Valid Username and Password'});
      }
  } else {
    res.render('login-page.ejs',{message: 'Please Enter Valid Username and Password'});
  }
} catch(err) {
  res.render('404-page.ejs');
}
}

const passwordRestReq = async(req,res)=> {
  try {
    res.render('reset-password.ejs');
  } catch(err) {
    console.log(err);
    res.render('404-page.ejs');
  }
}

const passwordReset = async(req,res) => {
  try {
    const user = req.body;
    const userEmail = req.body.email;
    const mailCheck = await userMailCheck(userEmail);
    if(mailCheck.rowCount > 0) {
      otpSending(userEmail,otp).then(()=> {
        res.render('reset-otp.ejs');
      }).catch((err)=> {
        res.render('404-page.ejs');
      })
    } else {
      res.render('reset-password.ejs',{message: 'Please Enter Valid Email'});
    }
  } catch(err) {
    console.log(err);
    res.render('404-page.ejs');
  }
}


const otpCheck = async(req,res) => {
  try {
    const enteredOtp = Number(req.body.otp);
    if(otp === enteredOtp) {
      res.render('password-submit.ejs');
    } else {
      res.render('reset-otp.ejs',{message: 'OTP Incorrect'});
    } 
  }catch(err) {
    console.log(err);
    res.render('404-page.ejs');
  }
}

const newPasswordHandler  = async(req,res) => {
  try {
    const newPasswordValue = req.body.newpassword;
    const gmail = sentGmail; 
    const hashedPassword = passwordBcrypt(newPasswordValue);
    const passwordUpd = await updatePassword(hashedPassword, gmail);
    if(passwordUpd.rowCount > 0) {
      res.render('reset-successful.ejs');
    } else {
      res.render('passwordreset-failed.ejs');
    }
  } catch(err) {
    console.log(err);
    res.render('404-page.ejs');
  }
};


const userNameFindreq = async(req,res)=> {
  try {
    res.render('username-find.ejs');
  } catch(err) {
    console.log(err);
    res.render('404-page.ejs');
  }
}

const userNameFind = async(req,res)=> {
  try {
  const requestedEmail  = req.body.email;
  const mailCheck = await userMailCheck(requestedEmail);
  if(mailCheck.rowCount > 0) {
    const gmail = mailCheck.rows[0].email;
    const userData = await getUserNameByEmail(gmail);
    const userName = userData.rows[0].user_name;
    const text = `Your UserName of BlogApi - ${userName}`;
    userNameSending(gmail,userName).then(()=> {
      res.render('username-send.ejs');
    }).catch((err)=> {
      console.log(err);
      res.render('404-page.ejs');
    })
  } else {
    res.render('username-find.ejs',{message:'Please Enter Valid Mail'});
  }
} catch(err) {
  res.render('404-page.ejs');
  console.log(err);
}
}


const getDetailsFromGoogle = async(req,res)=> {
  try{
  const userDetails = req.session.passport.user;
  const mailCheck = await userMailCheck(userDetails.email);
  const gooleIdCheck = await getGoogleIdbyEmail(userDetails.email);
  const nameCheck = await checkUserName(userDetails.displayName);

  if(mailCheck.rowCount > 0 && gooleIdCheck.rows[0].google_id === null) {
    const message = 'Please log in using your existing username and password'
    return res.render('signup-failed.ejs', { message });
  }

  if(mailCheck.rowCount > 0 && gooleIdCheck.rowCount[0] !== null) {
    const apiKeyData = (await getApiKeyBymail(userDetails.email, userDetails.id)).rows;
    const apiKey = apiKeyData[0].api_key;
    return res.render('api-key.ejs',{apiKey});
  }

  if(mailCheck.rowCount === 0 && gooleIdCheck.rowCount[0] === undefined) {
    const apiKey = uuidv4();
    const hashedPassword = passwordBcrypt(uuidv4());
    if(nameCheck.rowCount > 0) {
      const message = "Sorry, that username's taken. Try a different email"
      return res.render('signup-failed.ejs', { message });
    }
    const newUser = await registerNewUserBygoogle(userDetails.displayName, userDetails.email, hashedPassword,apiKey,userDetails.id);
    if(newUser.rowCount > 0) {
      const apiKeyData = (await getApiKeyBymail(userDetails.email)).rows;
      const apiKey = apiKeyData[0].api_key;
      return res.render('api-key.ejs', { apiKey }); 
    }
  }
}catch(err) {
  res.render('404-page.ejs');
  console.log(err);
}
}


passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback", 
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
        const userDetails = profile;
          return cb(null,userDetails);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});



export { signup, createUser, login, loginCredentials, passwordRestReq, passwordReset, otpCheck,newPasswordHandler ,userNameFindreq, userNameFind, getDetailsFromGoogle }

