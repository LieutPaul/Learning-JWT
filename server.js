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
        console.log(user);
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
    console.log("Get request from /posts")
    console.log(req.user)
    res.json(posts.filter(post => post.name === req.user.name));
});


app.post("/login", (req,res)=>{
    const username = req.body.username
    const user = {name : username};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken : accessToken});
});



app.listen(3000,()=>{
    console.log("Listening on port 3000.")
})