import { userCheckByApiKey } from '../models/data.js';

export const validingApiKey =  async (req,res,next)=> {
  const inpApiKey =  (req.headers.apikey).trim();
 if(inpApiKey.length > 36 || inpApiKey.length < 10) {
    return res.status(400).json({error:'Enter Valid ApiKey'});
 }
  const user = await userCheckByApiKey(inpApiKey);
  if(user.rowCount === 0) {
    return res.status(400).json({error:'Unauthorized ApiKey'});
  } 
  next();
};

