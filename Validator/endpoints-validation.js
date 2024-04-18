import { query,body,param, validationResult } from 'express-validator';
import { isEmptyField, numberAreNot, idValidation, CommentDataValidation } from './endpoints-utils.js';


const blogIdValidation = (req,res,next)=> {
  try {
  const blogId =  (req.params.id).trim();
  const error = idValidation(res,blogId);
  if(!error) {
    next();
  }
  } catch(err) {
    res.status(500).json({message: 'Something went wrong try again'});
    console.log(err);
  }
}


const blogTypeValidation = (req,res,next)=> {
  try {
  const typeOfBlog = (req.query.type).trim();
  if(!req.query.type) {
    res.status(400).json({error:'Missing required query parameter type'});
  } else if(isEmptyField(typeOfBlog)) {
    res.status(400).json({error:'type fields must have values'});
  }else if(typeOfBlog.length < 5 || typeOfBlog.length > 30) {
    res.status(400).json({error:'Please enter valid key Name'});
  } else {
    next();
  }
} catch(err) {
  res.status(500).json({message: 'Something went wrong try again'});
  console.log(err);
}
}


const blogSearchValidation = (req,res,next)=> {
  const inpBlogSearch = (req.params.search).trim();
  if(inpBlogSearch === ':search') {
    return res.status(400).json({error:'Missing required path parameter'});
  } else if(inpBlogSearch.length < 4 || inpBlogSearch.length > 30) {
    return res.status(400).json({error:'Blog search term must be between 4 and 30 characters'});
  } else {
    next();
  }
}

const blogDataValidation = (req,res,next)=> {
  try{
    const {title} = req.body
    const {content} = req.body
    const {type} = req.body
    if(title === undefined|| content === undefined || type === undefined) {
      return res.status(400).json({error: 'Please provide all required fields: title, content, type'});
    } else if(isEmptyField(title) || isEmptyField(content) || isEmptyField(type)) {
      return res.status(400).json({error: 'All fields (title, content, type) must have values'});
    } else if(title.length < 4) {
      return res.status(400).json({error: 'Title must be at least 4 characters long'});
    } else if(content.length < 20){
      return res.status(400).json({error: 'Content must be at least 20 characters long'});
    } else if(type.length > 30 || type.length < 5) {
      return res.status(400).json({error: 'Type must be between 5 and 30 characters long'});
    } else {
      next();
    }
  }catch(err) {
    res.status(500).json({message: 'Something went wrong try again'});
    console.log(err);
  }
}

const commentValidation = (req,res,next)=> {
  const blogId = (req.params.blogid).trim();
  const {comment} = req.body;
  const idValidationError = idValidation(res,blogId);
  if(idValidationError) {
    return;
  } 
  const commentValidationError = CommentDataValidation(res,comment);
  if(commentValidationError) {
    return;
  }
  next();
}

const editCommentValidation = (req,res,next)=> {
  const commentId = (req.params.id).trim();
  const {comment} = req.body;
  const idValidationError = idValidation(res,commentId);
  if(idValidationError) {
    return;
  }
  const commentValidationError = CommentDataValidation(res,comment);
  if(commentValidationError) {
    return;
  }

  next();
}

const deletecommentIdValidation = (req,res,next)=> {
  const commentId = (req.params.id).trim();
  const commentIdValidationError = idValidation(res,commentId);
  if(commentIdValidationError) {
    return
  }
  next();
}


export {blogIdValidation, blogTypeValidation, blogSearchValidation, blogDataValidation, commentValidation, editCommentValidation, deletecommentIdValidation};