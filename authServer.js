require('dotenv').config()

const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

let refreshTokens = [] // The refresh tokens of all the users

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15s'});
}

function generateRefreshToken(user){
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
}

app.delete("/logout",(req,res)=>{
    // As long as the user has the refresh toke, they can create infinite access tokens
    const refreshToken = req.body.token // Making the refresh Token no longer valid
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    console.log(refreshTokens);
    res.sendStatus(204);
})

app.post("/token", (req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null){
        return res.sendStatus(401);
    }
    if(refreshTokens.includes(refreshToken) === false){
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name:user.name});
        res.json({accessToken : accessToken});
    })
});


app.post("/login", (req,res)=>{
    const username = req.body.username
    const user = {name : username};
    const accessToken = generateAccessToken(user) //Creating First Access token for the user
    const refreshToken = generateRefreshToken(user); //Creating Refresh token for the user
    // The same refresh token will be used by the user every time he wants to generate a new access token
    refreshTokens.push(refreshToken);
    res.json({accessToken : accessToken, refreshToken : refreshToken});
});



app.listen(4000,()=>{
    console.log("Listening on port 4000.")
})