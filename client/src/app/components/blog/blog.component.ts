import { ActivatedRouteSnapshot } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { BlogService } from './../../services/blog.service';




@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false; 
  form;
  username;
  blogPost;
  blog;
  commentform;
  newComment=[];


  constructor(
     private formBuilder : FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
    
    ) {
    this.creatNewBLogForm(); //to create new blog
    this.createNewCommentForm(); // to create new comment 
   }
  
  creatNewBLogForm(){
   this.form= this.formBuilder.group({
     title:  ['', Validators.required],
     body: ['', Validators.required],
   })
  }

  createNewCommentForm(){
    this.commentform = this.formBuilder.group({
      comment: ['', Validators.required],
      commentBy: ['', Validators.required] 
    })
  }

  //function to display new blog form
  newBlogForm(){
    this.newPost= true; // to show new blog form
  }
  
  //Function to post a new comment 
  //use to grab the id of blog user is trying to comment in and will delete it once user has posted comment
  draftComment(id){
    this.newComment= [];
    this.newComment.push(id);
}
cancelComment(id)
{
  const index = this.newComment.indexOf(id);
  this.newComment.splice(index, 1);
  this.commentform.reset();
}
  //function to submit a new blog post
  onBlogSubmit(){
      var blog = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
                  }
 this.blogService.newBlog(blog).subscribe(data => {
      if(!data.success){
        this.messageClass= "alert alert-danger";
        this.message= data.message;
       } else{
         this.message = data.message;
         this.messageClass="alert alert-success";
         this.getAllBlogs();
         setTimeout(() =>{ 
           this.newPost = false;
           this.form.reset();
         } ,2000)
        }
      })
    }

  goBack(){
   window.location.reload();
  }

  //to get all blogs
  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPost= data.blog;
    })
  }
  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    });

  }

  dislikeBlog(id){
  this.blogService.dislikeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    });
  }

  postComment(id){
    const comment = this.commentform.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.commentform.reset();
    })
  }

  ngOnInit() {
    this.authService.getprofile().subscribe(data=>{
      this.username= data.user.username;
    });
    this.getAllBlogs();

    
  }

}
