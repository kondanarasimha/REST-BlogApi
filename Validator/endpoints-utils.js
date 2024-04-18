const isEmptyField = (value) => (/^\s*$/.test(value));
const gmailFormatCheck = (gmail) => (!(/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)));
const numberAreNot = (number)=> (!(/^\d+$/).test(number));


function idValidation(res,id) {
  if(isEmptyField(id)) {
    return res.status(400).json({error:'id fields must have values'});
  } else if(numberAreNot(id)) {
    return res.status(400).json({error:'id must be a number'});
  } else if (id === ':id' || id.length > 6) {
    return res.status(400).json({error:'Missing Id'});
  } 
  return null;
}

function CommentDataValidation(res,comment) {
  if(comment === undefined) {
    return res.status(400).json({error: 'Missing required parameter'});
  } else if(isEmptyField(comment)) {
    return res.status(400).json({error: 'Comment field must have values'});
  } else if(comment.length < 4) {
    return res.status(400).json({error: 'comment must be at least 4 characters long'});
  } 
  return null;
}

export { isEmptyField, gmailFormatCheck, numberAreNot, idValidation, CommentDataValidation }