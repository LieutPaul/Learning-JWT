require('dotenv').config()

const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

let refreshTokens = []

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15s'});
}

function generateRefreshToken(user){
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
}

app.post("/token", (req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null){
        return res.status(401);
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403);
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403);
        const accessToken = generateAccessToken({name:user.name});
        res.json({accessToken : accessToken});
    })
});


app.post("/login", (req,res)=>{
    const username = req.body.username
    const user = {name : username};
    const accessToken = generateAccessToken(user) //Creating token for the user
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({accessToken : accessToken, refreshToken : refreshToken});
});



app.listen(4000,()=>{
    console.log("Listening on port 4000.")
})