import express from 'express';
import { signup, createUser, login, loginCredentials, passwordReset, passwordRestReq, otpCheck, newPasswordHandler, userNameFindreq,userNameFind, getDetailsFromGoogle } from '../controller/authencation-controller.js';
import { signupValidation,passwordValidation } from '../Validator/credentials-validation.js';
import passport from "passport";

const router = express.Router();

router.get('/signup',signup);

router.post('/signup',signupValidation,createUser);

router.get('/login',login);

router.post('/login',loginCredentials);

router.get('/password_reset',passwordRestReq);

router.post('/password_reset',passwordReset);

router.post('/otpcheck',otpCheck);

router.post('/newpassword',passwordValidation,newPasswordHandler);

router.get('/username',userNameFindreq);

router.post('/username',userNameFind);

router.get('/auth/google/login',passport.authenticate("google",{scope: ["profile","email"]}));

router.get('/googleuser',getDetailsFromGoogle);


router.get('/auth/google/callback',passport.authenticate("google",{
  successRedirect: "/googleuser",
  failureRedirect: "/failuretest"
}));



export {router}




