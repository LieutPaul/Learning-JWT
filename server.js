require('dotenv').config()

const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

function authenticateToken(req,res,next) { //MiddleWare to check if token is valid
    //Header - Bearer TOKEN
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            res.sendStatus(403); //Invalid Token => No Access
        }
        req.user = user;
        // console.log(user);
        next();
    })
}

const posts=[
    {
        name:"Vikas",
        post:"post1"
    },

    {
        name:"Vikas2",
        post:"post2"
    }
]

app.get("/posts",authenticateToken,(req,res)=>{ 
    // authenticateToken is a middleware function that authorizes the token sent by the user
    // This function will run only if authenticateToken calls next(), otherwise it will send Status 403
    console.log("Get request from /posts")
    res.json(posts.filter(post => post.name === req.user.name));
});

app.listen(3000,()=>{
    console.log("Listening on port 3000.")
})