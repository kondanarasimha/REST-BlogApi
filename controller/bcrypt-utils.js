import bcrypt, { hash } from 'bcrypt';

const saltRounds = 10;

function passwordBcrypt(password) { 
  try {
  return bcrypt.hashSync(password, saltRounds);
  } catch(err) {
    console.log(err);
  }
}

function passwordCheck(inputPassowrd,hasedPassword) {
  try {
  return bcrypt.compareSync(inputPassowrd, hasedPassword);
  } catch {
    console.log(err);
  }
}


export { passwordBcrypt, passwordCheck };





