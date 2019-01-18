
import { Component, OnInit } from '@angular/core';
import{ Location } from'@angular/common';
import{ ActivatedRoute, Router } from'@angular/router';
import { BlogService } from './../../../services/blog.service';


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

message;
messageClass;
blog;
currentUrl;
loading = true;

  constructor( private location : Location,
                private activatedRoute :ActivatedRoute,
                private blogService :BlogService,
                private router : Router) { }

  editBlogSubmit(){
    //submit  function updated blog
    this.blogService.editBlogSubmit(this.blog).subscribe(data =>{
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message= data.message;
      } else{
        this.messageClass = "alert alert-success";
        this.message= data.message;
        this.router.navigate(['/blog']);
      }

    })

  }
  goBack(){
    this.location.back();
    }


  ngOnInit() {
    //to grab the id from url 
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data =>{
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message= data.message;

      }else{
        this.blog=  data.blog;
        this.loading = false;
      }
    })
  }

}
