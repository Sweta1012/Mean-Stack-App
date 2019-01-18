const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


 const BlogSchema = new Schema({
   title: {type: String, required: true},
   body: {type: String, required: true},
   createdBy:{type: String},
   createdAt:{ type:Date, default:Date.now() },
   likes: { type: Number, default:0 },
   likedBy: { type:Array },
   dislikes: { type: Number, default:0 },
   dislikedBy: { type:Array },
    comments: [{
      comment: { type:String },
      commentby: { type:String }
    }]
  });
  
  module.exports = mongoose.model('Blog', BlogSchema);

