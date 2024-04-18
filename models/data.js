import pg from 'pg';

const db = new pg.Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
db.connect();

const userCheckByApiKey = async(inpApiKey)=> await db.query("SELECT api_key FROM users WHERE api_key = $1",[inpApiKey]);

const getBlogs = async()=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount");

const getBlogById = async(id)=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id WHERE b.id = $1 GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount",[id]);

const getBlogByFilter = async(type)=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id WHERE b.type ILIKE $1 GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount",['%'+ type +'%']);


const searchingForBlog = async(searchValue)=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id WHERE b.title ILIKE $1 OR b.content ILIKE $2 GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount",['%'+searchValue+'%','%'+searchValue+'%']);


const apiKeyByUserId = async(apiKey)=> await db.query("SELECT id FROM users WHERE api_key = $1",[apiKey]);

const insertingNewBlog = async(title,content,blogType,userId,todayDate)=> await db.query('INSERT INTO blogs(title,content,type,user_id,created_date) VALUES($1,$2,$3,$4,$5)',[title,content,blogType,userId,todayDate]);

const getBlogByUserId = async(userId)=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id WHERE u.id = $1 GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount ORDER BY b.id DESC",[userId]);

const updtingExistingBlog = async(title,content,blogType,blogId)=> await db.query("UPDATE blogs SET title = $1, content = $2, type = $3 WHERE id = $4",[title,content,blogType,blogId]);

const getUserIdInBlogTable = async(blogId)=> await db.query("SELECT user_id FROM blogs WHERE id = $1",[blogId]); 

const deleteCommentByBlogId = async(blogId)=> await db.query("DELETE FROM comments WHERE blog_id = $1",[blogId]);

const deleteBlogByBlogId = async(blogId)=> await db.query("DELETE FROM blogs WHERE id = $1",[blogId]);

const postingComment = async(blogid,userId,comment)=> await db.query("INSERT INTO comments(blog_id,user_id,comment) VALUES($1,$2,$3)",[blogid,userId,comment]);

const getUserIdInCommentTable = async(commentId)=> await db.query("SELECT user_id FROM comments WHERE id = $1",[commentId]);

const updtingExistingComment = async(comment,commentId)=> await db.query("UPDATE comments SET comment = $1 WHERE id = $2",[comment,commentId]); 

const getBlogByCommentId = async(commentId)=> await db.query("SELECT b.id,u.user_name,b.title,b.content,b.type,b.created_date,COALESCE(l.likeCount, 0) AS likeCount,json_agg(json_build_object('id', c.id, 'userName', us.user_name, 'comment', c.comment)) AS comments FROM users AS u JOIN blogs AS b ON b.user_id = u.id LEFT JOIN comments AS c ON c.blog_id = b.id LEFT JOIN (SELECT blog_id,COUNT(*) AS likeCount FROM likes GROUP BY blog_id) AS l ON l.blog_id = b.id LEFT JOIN users AS us ON c.user_id = us.id WHERE c.id = $1 GROUP BY b.id, u.user_name, b.title, b.content, b.type, b.created_date, l.likeCount",[commentId]);

const deleteCommentByCommentId = async(commentId)=> await db.query("DELETE FROM comments WHERE id = $1",[commentId]);

const likedAreNot = async(blogId,userId)=> await db.query("SELECT blog_id,user_id,like_count FROM likes WHERE blog_id = $1 AND user_id = $2 AND like_count = 1",[blogId,userId]);

const addLike = async(blogId,userId)=> await db.query("INSERT INTO likes(blog_id,user_id,like_count) VALUES ($1,$2,$3)",[blogId,userId,1]);

const removeLike = async(blogId,userId)=> await db.query("DELETE FROM likes WHERE blog_id = $1 AND user_id = $2",[blogId,userId]);


export { getBlogs, getBlogById, getBlogByFilter, searchingForBlog, apiKeyByUserId, insertingNewBlog, getBlogByUserId, updtingExistingBlog, getUserIdInBlogTable, deleteCommentByBlogId, deleteBlogByBlogId, postingComment, getUserIdInCommentTable, updtingExistingComment, getBlogByCommentId, deleteCommentByCommentId,likedAreNot, addLike, removeLike, userCheckByApiKey }

