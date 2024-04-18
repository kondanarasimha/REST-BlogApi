import express from 'express';
import { blogs,randomBlog, blogById, blogByFilter, searchBlog, createNewBlog, editBlog, deleteBlog, commentOnBlog, editComment,deleteComment, likeBlog, unlikeBlog } from '../controller/data-controller.js';
import { validingApiKey } from '../Validator/apikey-validation.js';
import { blogIdValidation, blogTypeValidation, blogSearchValidation, blogDataValidation, commentValidation, editCommentValidation, deletecommentIdValidation } from '../Validator/endpoints-validation.js';

const dataRouter = express.Router();

dataRouter.get('/api/blogs',blogs);

dataRouter.get('/api/blog/random',randomBlog);

dataRouter.get('/api/blog/:id',blogIdValidation,blogById);

dataRouter.get('/api/blog',blogTypeValidation,blogByFilter);

dataRouter.get('/api/blogs/:search',blogSearchValidation,searchBlog);

dataRouter.post('/api/newblog',validingApiKey,blogDataValidation,createNewBlog);

dataRouter.put('/api/blog/edit/:id',validingApiKey,blogDataValidation,editBlog);

dataRouter.delete('/api/blog/delete/:id',validingApiKey,blogIdValidation,deleteBlog);

dataRouter.post('/api/blog/comment/:blogid',validingApiKey,commentValidation,commentOnBlog);

dataRouter.put('/api/edit/comment/:id',validingApiKey,editCommentValidation,editComment);

dataRouter.delete('/api/delete/comment/:id',validingApiKey,deletecommentIdValidation,deleteComment);

dataRouter.post('/api/like/blog/:id',validingApiKey,blogIdValidation,likeBlog);

dataRouter.delete('/api/unlike/blog/:id',validingApiKey,blogIdValidation,unlikeBlog);

export {dataRouter}