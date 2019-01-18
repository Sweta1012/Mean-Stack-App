
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  options;
  authtoken;
 


  constructor(private authService: AuthService,
                      private http: Http
    ) { }
 // Fn to create headers, add tokens , to be  used in HTTP request
  //call this service to the paths you need to attach this header.
  createAuthenticationHeader(){
    this.authService.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authtoken': this.authService.authtoken //attach token
      })
    });
  } 
//fn to create new blog post
  newBlog(blog){
       this.createAuthenticationHeader();
return this.http.post('http://localhost:8080/blog/newblog', blog, this.options).pipe(map(res => res.json()));
    }

getAllBlogs(){
  this.createAuthenticationHeader();
  return this.http.get('http://localhost:8080/blog/allblogs',this.options).pipe(map(res => res.json()));
}

getSingleBlog(id){
  this.createAuthenticationHeader();
  return this.http.get('http://localhost:8080/blog/editBlog/'+ id, this.options).pipe(map(res => res.json()));
}
editBlogSubmit(blog){
  this.createAuthenticationHeader();
  return this.http.put('http://localhost:8080/blog/updateblog', blog, this.options).pipe(map(res => res.json()));
}
deleteblog(id){
  this.createAuthenticationHeader();
  return this.http.delete('http://localhost:8080/blog/deleteblog/'+ id, this.options).pipe(map(res => res.json()));}

likeBlog(id){
  const blogData={ id: id } 
  return this.http.put('http://localhost:8080/blog/likeblog/',blogData, this.options).pipe(map(res => res.json()));
}

dislikeBlog(id){
  const blogData={ id: id }
  return this.http.put('http://localhost:8080/blog/dislikeblog/',blogData, this.options).pipe(map(res => res.json()));
 
}
postComment(id, comment){
  this.createAuthenticationHeader();
  const blogData ={
    id: id,
    comment: comment
  }
  return this.http.post('http://localhost:8080/blog/comment/',blogData, this.options).pipe(map(res => res.json()));
}


}
