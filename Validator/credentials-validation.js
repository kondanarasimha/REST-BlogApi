import ejs from 'ejs';
import { isEmptyField, gmailFormatCheck } from './endpoints-utils.js';

const ResrenderError = (res,message)=> {
  res.render('signup-page.ejs',{message});
} 
 
const signupValidation = (req,res,next) => {
  try {
  const username = (req.body.username).trim();
  const email = (req.body.email).trim();
  const password = (req.body.password).trim();
  if(isEmptyField(username) || username.length > 15 || username.length < 5) {
    ResrenderError(res,'UserName Not Accepted');
  } else if(isEmptyField(email) || gmailFormatCheck(email) || email.length > 30 || email.length < 14) {
    ResrenderError(res,'MailId Not Accepted'); 
  } else if(isEmptyField(password) || password.length > 25 || password.length < 5) {
    ResrenderError(res,'Password Not Accepted'); 
  } else {
    next();
  }
} catch(err) {
  res.render('404-page.ejs');
  console.log(err);
}
}

const passwordValidation = (req,res,next) => {
  try {
  const newpassword = (req.body.newpassword).trim();
  if(isEmptyField(newpassword) || newpassword.length < 5 || newpassword.length > 25) {
    res.render('password-submit.ejs',{message: 'Password Not Accepted'});
  } else {
    next();
  }
} catch(err) {
  res.render('404-page.ejs');
  console.log(err);
}
}

export { signupValidation, passwordValidation }
