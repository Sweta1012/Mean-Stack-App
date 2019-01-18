
const Blog =  require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
module.exports = (router) =>
{
    //blog routes goes here
    router.post('/newblog', (req,res)=> {
      if(!req.body.title && req.body.title===""){
        res.json({success:false, message: "Please provide blog title"});
      }else{
        if(!req.body.body && req.body.body===""){
                res.json({success:false, message: "Please provide blog body"});
              } else{
                  if(!req.body.createdBy && req.body.createdBy===""){
                    res.json({success:false, message: "Please provied blog creator"});
                  } else{
                    const blog = new Blog({
                        title:req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err)=> {
                        if(err){
                            res.json({success:false, message: err.errmsg});
                        }                                                                                                    // if(err.code === 11000 ){ //     res.json({ success: true, message:"Blog saved!!"});  //  } else{ } 
                        else{
                            res.json({success:true, message:" Blog saved!!"});
                        }
                    });
                  }
                }
            }
        });


        router.get('/allblogs', (req,res)=> {
            Blog.find({}, (err,blog)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(!blog){
                        res.json({success: false, message:'No blog found'});
                    } else{
                        res.json({success:true ,blog:blog});
                    }
                }
            }).sort({ '_id': -1});

        });

        router.get('/editBlog/:id',(req, res)=> {
            if(!req.params.id){
                res.json({ success:false, message: 'No blog id was  provided' });
            } else{
                Blog.findOne({ _id: req.params.id }, (err, blog)=> {
                    if(err){
                        res.json({ success:false, message: 'Not valid blog id' });
                    } else{
                        if(!blog){
                            res.json({ success:false, message:'Blog not found' });
                        } else{
                            User.findOne({ _id : req.decoded.userId}, (err, user)=>{
                                if(err){
                                    res.json({ success:false, message: err });
                                } else{
                                    if(!user){
                                        res.json({ success:false, message:'Unable to authenticate user' });
                                    } else{
                                        if(user.username !== blog.createdBy){
                                            res.json({ success:false, message:'Not authorized to edit this blog' });
                                        }  else{ 
                                            res.json({ success:true, blog: blog });
                                         }
                                    }
                                }
                            })
                        }
                        
                    }
                });
            }
        });

        router.put('/updateblog', (req,res)=> {
            if(!req.body._id){
                res.json({ success: false, message: "No blog id provided"});
            }else{
                Blog.findOne({ _id: req.body._id }, (err, blog)=>{
                    if(err){
                        res.json({ success:false, message:'Invalid blog id'});
                    }else{
                        if(!blog){
                            res.json({ success:false, message:'Blog id was not found'});
                        } else{
                            User.findOne( {_id: req.decoded.userId}, (err,user)=>{
                                if(err){
                                    res.json({ success: false, message: err});
                                }else{
                                    if(!user){
                                        res.json({ success: false, message: "unable to authenticate user"});
                                    }else{
                                        if(user.username !== blog.createdBy){
                                            res.json({ success: false, message: "You are not authorized to enable this blog post"});
                                        }else{
                                            // perform the update
                                            blog.title =req.body.title;
                                            blog.body = req.body.body;
                                            blog.save((err)=>{
                                                if(err){
                                                    res.json({ success: false, message: err});
                                                } else{
                                                    res.json({ success: true, message: "Blog updated"});
                                                } 
                                                
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    }
                    
                })
            }
        })

        router.delete('/deleteblog/:id', (req,res)=>{
            if(!req.params.id){
                res.json({ success:false, message: 'No blog id was provided' });
            } else{
                Blog.findOne({ _id: req.params.id }, (err, blog)=> {
                    if(err){
                        res.json({ success:false, message: 'Not valid blog id' });
                    } else{
                        if(!blog){
                            res.json({ success:false, message:'Blog not found' });
                        } else{
                            User.findOne({ _id : req.decoded.userId}, (err, user)=>{
                                if(err){
                                    res.json({ success:false, message: err });
                                } else{
                                    if(!user){
                                        res.json({ success: false, message: "Unable to authenticate user"});
                                    }else{
                                        if(user.username !== blog.createdBy){
                                            res.json({ success:false, message:'Not authorized to delete this blog' });
                                        } else{
                                            blog.remove((err)=>{
                                                if(err){
                                                    res.json({ success: false, message: "Unable to delete blog"});
                                                } else{
                                                    res.json({ success: true, message: "Blog deleted!"});
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
        router.put('/likeblog', (req,res)=> {
            if(!req.body.id){
                res.json({ success: false, message: "No blog id provided"});
            } else{
                Blog.findOne({ _id: req.body.id }, (err, blog)=>{
                    if(err){
                        res.json({ success:false, message:'Invalid blog id'});
                    } else{
                        if(!blog){
                            res.json({ success:false, message:'Blog not found'});   
                        } else{
                            User.findOne({ _id: req.decoded.userId}, (err, user)=>{
                                if(err){
                                    res.json({success: false, message:'something went worng'});
                                } else{
                                    if(!user){
                                        res.json({ success:false, message:'Unable to authenticate user'});
                                    } else{
                                        if(user.username == blog.createdBy){
                                            res.json({ success:false, message:'Cannot like your own post'});
                                        } else{
                                            if(blog.likedBy.includes(user.username)){ //likedBy is an array
                                                res.json({ success:false, message:'You already liked the post'});
                                            } else{
                                                if(blog.dislikedBy.includes(user.username)){
                                                    blog.dislikes--;// decrement the dislikes 
                                                    const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                                    blog.dislikedBy.splice(arrayIndex, 1);
                                                    blog.likes ++;
                                                    blog.likedBy.push(user.username);
                                                    blog.save((err)=>{
                                                        if(err){
                                                            res.json({success: false, message:'something went worng'});
                                                        } else{
                                                            res.json({success: true, message:'Blog Liked!'});
                                                        }
                                                    });
                                                } else{
                                                    blog.likes ++;
                                                    blog.likedBy.push(user.username);
                                                    blog.save((err)=>{
                                                        if(err){
                                                            res.json({success: false, message:'something went worng'});
                                                        } else{
                                                            res.json({success: true, message:'Blog Liked!'});
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });


        router.put('/dislikeblog', (req,res)=> {
            if(!req.body.id){
                res.json({ success: false, message: "No blog id provided"});
            } else{
                Blog.findOne({ _id: req.body.id }, (err, blog)=>{
                    if(err){
                        res.json({ success:false, message:'Invalid blog id'});
                    } else{
                        if(!blog){
                            res.json({ success:false, message:'Blog not found'});   
                        } else{
                            User.findOne({ _id: req.decoded.userId}, (err, user)=>{
                                if(err){
                                    res.json({success: false, message:'something went worng'});
                                } else{
                                    if(!user){
                                        res.json({ success:false, message:'Unable to authenticate user'});
                                    } else{
                                        if(user.username == blog.createdBy){
                                            res.json({ success:false, message:'Cannot dislike your own post'});
                                        } else{
                                            if(blog.dislikedBy.includes(user.username)){ //dislikedBy is an array
                                                res.json({ success:false, message:'You already disliked the post'});
                                            } else{
                                                if(blog.likedBy.includes(user.username)){
                                                    blog.likes--;// decrement the likes 
                                                    const arrayIndex = blog.likedBy.indexOf(user.username);
                                                    blog.likedBy.splice(arrayIndex, 1);
                                                    blog.dislikes++;
                                                    blog.dislikedBy.push(user.username);
                                                    blog.save((err)=>{
                                                        if(err){
                                                            res.json({success: false, message:'something went worng'});
                                                        } else{
                                                            res.json({success: true, message:'Blog Disliked!'});
                                                        }
                                                    });
                                                } else{
                                                    blog.dislikes ++;
                                                    blog.dislikedBy.push(user.username);
                                                    blog.save((err)=>{
                                                        if(err){
                                                            res.json({success: false, message:'something went worng'});
                                                        } else{
                                                            res.json({success: true, message:'Blog Disliked!'});
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }); 

        router.post('/comment', (req,res)=>{
            if(!req.body.comment){
                res.json({ success:false, message:'No comments provided'});
            } else{
                if(!req.body.id){
                    res.json({ success:false, message:'No id was provided'});
                } else{
                    Blog.findOne({ _id: req.body.id }, (err, blog)=> {
                        if(err){
                            res.json({ success:false, message: "Invalid blog"});
                        } else{
                            if(!blog){
                                 res.json({ success:false, message: "Blog not found"});
                            } else{
                                User.findOne({ _id: req.decoded.userId}, (err, user)=>{
                                    if(err){
                                        res.json({ success:false, message: "Something went worng"});
                                    } else{
                                        if(!user){
                                            res.json({ success:false, message: "Blog not found"});
                                        } else{
                                            blog.comments.push({
                                                comment: req.body.comment,
                                                commentby: user.username
                                            });
                                            blog.save((err)=>{
                                                if(err){
                                                    res.json({success: false , message:"Unable to comment"});
                                                } else{
                                                    res.json({ success: true, message: "comment saved!"});
                                                }
                                            })
                                        }
                                    }
                                });

                            }
                        }
                    })
                }
            }
        });
    return router;
}