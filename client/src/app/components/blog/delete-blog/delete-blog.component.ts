import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute , Router } from '@angular/router';
import { BlogService } from './../../../services/blog.service';


@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  messageClass;
  message;
  blog;
  deleteblogUrl;

  constructor( 
    private blogService: BlogService,
    //for delete route
    private activatedRoute : ActivatedRoute,
    private router : Router

  ) { }


  deleteblog(){
    //for delete route
    
    this.blogService.deleteblog(this.deleteblogUrl.id).subscribe(data =>{
        if(!data.success){
          this.messageClass="alert alert-danger";
          this.message = data.message;
        } else{
          this.messageClass="alert alert-success";
          this.message = data.message;
          this.router.navigate(['/blog']);
    
        }
    })
  }
  ngOnInit() {
    this.deleteblogUrl =this.activatedRoute.snapshot.params;
  }

}
