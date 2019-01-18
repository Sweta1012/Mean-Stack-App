const User =  require('../models/user');
const jwt = require('jsonwebtoken');
module.exports = (router) =>
{
    //***************/
    //REGISTER ROUTE
    //***************/
router.post('/register', (req,res)=>{
    if(!req.body.email && req.body.email === ""){
        res.json({success: false, message:"you must provide an email"});
        }else{
        if(!req.body.username && req.body.username === ""){
            res.json({success: false, message:"you must provide a username"});
        } else{
            if(!req.body.password && req.body.password === ""){
                res.json({success: false, message:"you must provide a password"});
            } else {
             let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password:req.body.password
             });
             //SAVE USER
             user.save((err) => {
              if(err){
                  // Check if error is an error indicating duplicate account
                 if(err.code === 11000 ){
                    res.json({ success: false, message:"Username or password is already exists"});
                 }else { 
                     //return this error if its other error than duplicate
                    res.json({ success: false, message:"Could Not save user. Error", err}); }
                    } 
                    else {
                        //return success
                 res.json({ success: true, message: "Congarts!! Your account is registered"}); }
                });
             }
         }
     } 
});
   //***************/
    //LOGIN ROUTE
    //***************/
    router.post('/login', (req,res)=>{
       if(!req.body.username && req.body.username === ""){
            res.json({ success: false, message:"you must provide a username"});
        } else{
            if(!req.body.password && req.body.password === ""){
                res.json({ success: false, message:"you must provide a password"});
            } else{
                User.findOne({ username:req.body.username}, (err,user) => {
                    if(err){
                        res.json({success:false, message:err});
                        } else{
                            if(!user){
                                res.json({ success : false, message: "User not found"});
                                }  else {
                                     if(!(user.password === req.body.password)){
                                        res.json({ success: false, message: "Password Invalid "});
                                     } else{
                                        const token = jwt.sign({ userId: user._id}, 'Solanki', {
                                            'expiresIn': '24h' });
                                    res.json({ success:true , message:'Success!', 
                                    token: token, user:{username:user.username }, isLoggedIn: true});
                                 }             
                             }
                        }
                 });
             }
         }
 });
//Middleware function
router.use((req, res, next) => {
  const token = req.headers['authtoken'];
  if(!token){
      res.json({ success: false, message:"No token provided"});
  } else{
      jwt.verify(token, 'Solanki', (err, decoded) => {
        if(err){
            res.json({success:false, message: "token invalid" +err })
        }else{
            req.decoded = decoded;
            next();
        }
      });
    }
});
//***************/
    //Route to get user profile data
    //***************/

 router.get('/profile',(req, res) =>{
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user)=> {
        if(err){
            res.json({ success: false, message:"User not found"});
        }else{ if (!user){
            res.json({success: false, message:'User not found'});
        }else{
            res.json({ success: true, user: user });
            }
         }
    });
});


    return router;
}