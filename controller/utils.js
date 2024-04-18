const randomIndexGen = (data)=> data[Math.floor(Math.random()*data.length)];

function otpGen() {
  for(let i = 0; i < 6; i++) {
    return Number(Math.floor(Math.random() * 90000));
  }
}
const otp = otpGen();

export { randomIndexGen, otp }