import dayjs from 'dayjs';
import { getBlogs, getBlogById, getBlogByFilter, searchingForBlog, apiKeyByUserId, insertingNewBlog, getBlogByUserId, updtingExistingBlog, getUserIdInBlogTable, deleteCommentByBlogId, deleteBlogByBlogId, postingComment, getUserIdInCommentTable, updtingExistingComment, getBlogByCommentId, deleteCommentByCommentId, likedAreNot, addLike, removeLike } from '../models/data.js';
import { randomIndexGen } from './utils.js';


const blogs = async(req,res)=> {
  try {
  const blogs = (await getBlogs()).rows;
  console.log(blogs);
  res.json(blogs);
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

const randomBlog = async(req,res)=> {
  try {
    const blogs = (await getBlogs()).rows;
    const randomBlog = randomIndexGen(blogs);
    console.log(randomBlog);
    res.json(randomBlog);
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

const blogById = async(req,res) => {
  try {
    const id = Number(req.params.id);
    const blog = (await getBlogById(id)).rows;
    if(blog.length === 0) {
      return res.status(404).json({message:'No blog found with the provided ID.'});
    }
    res.json(blog);
  }catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

const blogByFilter = async(req,res) => {
  try {
    const typeOfBlog = (req.query.type).trim();
    const blogs = (await getBlogByFilter(typeOfBlog)).rows;
    if(blogs.length === 0) {
      return res.status(404).json({message:'No blog found with the provided type.'});
    }
    res.json(blogs);
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

const searchBlog = async(req,res)=> {
  try {
  const searchValue = req.params.search;
  const blogs = (await searchingForBlog(searchValue)).rows;
  console.log(searchValue);
  if(blogs.length === 0) {
    return res.status(404).json({message:'No blog found with the provided search.'}); 
  }
    res.json(blogs);
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}


const createNewBlog = async(req,res)=> {
  try {
    const {apikey} = req.headers;
    const title = (req.body.title).trim();
    const content = (req.body.content).trim();
    const type = (req.body.type).trim();
    const todayDate = dayjs().format('DD-MM-YYYY');
    const userIdData = (await apiKeyByUserId(apikey));
    if(userIdData.rowCount === 0) {
      return res.status(404).json({message: 'Invalid API Key provided.'});
    }
    const userId = userIdData.rows[0].id;
    const newBlog = (await insertingNewBlog(title, content, type, userId, todayDate));
    if(newBlog.rowCount === 0) {
      return res.status(404).json({ error: 'Failed to create blog post.'});
    }
    const blogData = (await getBlogByUserId(userId));
    const blogs = blogData.rows;
    if(blogData.rowCount === 0) {
      return res.status(404).json({ error: 'No blogs found for this user.'});
    }
    res.status(200).json(blogs);
  } catch(err) {
    res.status(500);
    console.log(err);
  }
}

const editBlog = async (req,res) => {
  try {
  const {apikey} = req.headers;
  const blogId = Number(req.params.id);
  const updTitle = (req.body.title).trim();
  const updContent = (req.body.content).trim();
  const updType = (req.body.type).trim();
  const userIdData = await apiKeyByUserId(apikey);
  const blogData = await getUserIdInBlogTable(blogId);
  if(blogData.rowCount === 0 || userIdData.rowCount === 0) {
    return res.status(404).json({error: 'Unable to find the resource.'}); 
  } 
  const userId = userIdData.rows[0].id;  
  const blogUserId = blogData.rows[0].user_id;
  if(userId !== blogUserId) {
    return res.status(404).json({ error: 'Unauthorized to edit this blog post.'});
  }
  const updatingBlogData = await updtingExistingBlog(updTitle, updContent, updType, blogId);
  if(updatingBlogData.rowCount === 0) {
    return res.status(500).json({ error: 'Failed to update blog post.'})
  } 
  const upadtedBlogData = await getBlogById(blogId);
  const blog = upadtedBlogData.rows;
  if(upadtedBlogData.rowCount === 0) {
    return res.status(404).json({ error: 'No blogs found for this user.'});
  }
  res.json(blog);
} catch(err) {
  res.status(500);
  console.log(err);
}
}

const deleteBlog = async(req,res) => {
  try {
  const {apikey} = req.headers;
  const blogId = Number(req.params.id);
  const userIdData = await apiKeyByUserId(apikey);
  const blogData = await getUserIdInBlogTable(blogId);
  if(userIdData.rowCount === 0 || blogData.rowCount === 0) {
    res.status(404).json({error: 'Unable to find the resource.'}); 
    return
  }
  const userId = userIdData.rows[0].id;
  const blogIdByUserId = blogData.rows[0].user_id;
  if(userId !== blogIdByUserId) {
    return res.status(404).json({ error: 'Unauthorized to delete this blog post.'});
  }
  const deleteComment= await deleteCommentByBlogId(blogId);
  const deleteBlog = await deleteBlogByBlogId(blogId);
  if(deleteBlog.rowCount === 0) {
    return res.status(500).json({ error: 'Failed to delete blog post.'});
  } 
  res.status(200).json({ message: 'Blog deleted successfully.'});
} catch(err) {
  res.status(500);
  console.log(err);
}
}

const commentOnBlog = async(req,res) => {
  try {
  const {apikey} = req.headers;
  const blogId = Number(req.params.blogid);
  const comment = (req.body.comment).trim();
  const userIdData = await apiKeyByUserId(apikey);
  const blogIdData = await getBlogById(blogId);
  if(userIdData.rowCount === 0 || blogIdData.rowCount === 0) {
    return res.status(404).json({message: 'Unable to find the Resource.'});
  }
  const blogIdValue = blogIdData.rows[0].id;
  const userId = userIdData.rows[0].id;
  const insertComment = await postingComment(blogIdValue,userId,comment);
  if(insertComment.rowCount === 0) {
      return res.status(500).json({ error: 'Failed to comment on blog.'});
  }
  const commentedBlog = (await getBlogById(blogId)).rows;
  res.json(commentedBlog);
} catch(err) {
  res.status(500);
  console.log(err);
}
}

const editComment = async(req,res)=> {
  try {
  const commentId  = Number(req.params.id);
  const {apikey} = req.headers;
  const updatedCommentText = (req.body.comment).trim();
  const userIdData = await apiKeyByUserId(apikey);
  const userIdFromComments = await getUserIdInCommentTable(commentId);
  if(userIdData.rowCount === 0 || userIdFromComments.rowCount === 0) {
    return res.status(404).json({ error: 'Unable to find the resource.'});
  }
  const userId = userIdData.rows[0].id;
  const commentIdByuserId = userIdFromComments.rows[0].user_id;
  if(userId !== commentIdByuserId) {
    return res.status(403).json({ error: 'Unauthorized to edit this comment.'});
  }
  const updatingComment = await updtingExistingComment(updatedCommentText,commentId);
  if(updatingComment.rowCount === 0) {
    return res.status(404).json({ error: 'Failed to update the comment.'});
  }
  const updatedCommentData = await getBlogByCommentId(commentId);
  const updatedComment = updatedCommentData.rows[0];
  if(updatedCommentData.rowCount === 0) {
    return res.json('Failed to update the comment');
  }
  res.json(updatedComment);
  } catch(err) {
    console.log(err);
    res.status(500);
  }

}

const deleteComment = async(req,res)=> {
  try {
  const commentId = Number(req.params.id);
  const {apikey} = req.headers;
  const userIdData = await apiKeyByUserId(apikey);
  const userIdFromComments = await getUserIdInCommentTable(commentId);
  if(userIdData.rowCount === 0 || userIdFromComments.rowCount === 0) {
    return res.status(404).json({ error: 'Unable to find the resource.'});
  }
  const userId = userIdData.rows[0].id;
  const commentIdByuserId = userIdFromComments.rows[0].user_id;
  if(userId !== commentIdByuserId) {
    return res.status(403).json({ message: 'Unauthorized to delete this comment.'});
  }
  const deleteComment = await deleteCommentByCommentId(commentId)
  if(deleteComment.rowCount === 0) {
    res.status(400).json({error: 'Failed to deleted the comment.'});
  }
  res.status(200).json({message: 'Comment deleted successfully.'});
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

const likeBlog = async (req,res)=> {
  try {
  const blogId = Number(req.params.id);
  const {apikey} = req.headers;
  const userIdData = await apiKeyByUserId(apikey); 
  const blogIdData = await getBlogById(blogId);
  if(userIdData.rowCount === 0 || blogIdData.rowCount === 0) {
    return res.status(404).json({ error: 'Unable to find the resource.'});
  }
  const userId = userIdData.rows[0].id;
  const likeCheckData = await likedAreNot(blogId,userId);
  if(likeCheckData.rowCount > 0) {
    return res.status(404).json({ error: 'You have already liked this blog.'});
  }
  const likeInsert = await addLike(blogId,userId);
  if(likeInsert.rowCount === 0) {
    return res.status(500).json({ error: 'Failed to like the blog.'});  
  } 
  res.sendStatus(200);
} catch(err) {
  res.sendStatus(500);
  console.log(err);
}
}

const unlikeBlog = async(req,res) => {
  try {
  const blogId = Number(req.params.id);
  const {apikey} = req.headers;
  const userIdData = await apiKeyByUserId(apikey);
  const blogIdData = await getBlogById(blogId);
  if(userIdData.rowCount === 0 || blogIdData.rowCount === 0) {
    return res.status(404).json({ error: 'Unable to find the resource.'});
  }
  const userId = userIdData.rows[0].id;
  const likeCheckData = await likedAreNot(blogId,userId);
  if(likeCheckData.rowCount === 0) {
    return res.status(404).json({ error: 'You are not liked this blog.'});
  }
  const removingLike = await removeLike(blogId,userId);
  if(removingLike.rowCount === 0) {
    return res.status(500).json({ error: 'Failed to Unlike the blog.'});  
  }
  res.sendStatus(200);
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}


export{ blogs, randomBlog, blogById, blogByFilter, searchBlog, createNewBlog, editBlog, deleteBlog,commentOnBlog, editComment, deleteComment, likeBlog, unlikeBlog }