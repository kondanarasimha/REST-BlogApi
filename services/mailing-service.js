import nodemailer from 'nodemailer';
import env from 'dotenv';

env.config();

export let sentGmail  = '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


export function otpSending(gmail,otp) {
  const mailOptions = {
    name:'Blog API',
    from: 'blogapi@support',
    to: gmail,
    subject: 'Blog API: Password Reset OTP',
    text: `Here's your One-Time Password (OTP) to reset your password on Blog API: ${otp}.\n\nPlease do not share it with anyone. \n\nIf you didn't request a password reset, please ignore this email.\n\nNeed assistances feel free to contact- blogapi@support.`
  };

  return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(info.response);
        resolve();
      }
  })
    sentGmail  =  gmail;
  })
}


export function userNameSending(gmail,userName) {
  const mailOptions = {
    name:'Blog API',
    from: 'blogapi@support',
    to: gmail,
    subject: 'Blog API: Username Reminder',
    text: `Hi ${userName},\n\nThis email confirms your username for Blog API: ${userName}.\n\nIf you didn't request this information please ignore this email.\n\nNeed assistances feel free to contact- blogapi@support.`
  };

  return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(info.response);
        resolve();
      }
  })
  })
}








