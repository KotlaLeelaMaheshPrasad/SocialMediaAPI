const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

authMiddleware = (request, response, next) => {
    console.log(request.headers.authorization);
    const jwtToken = request.headers.authorization.split(" ")[1];
    console.log(jwtToken);
    if(!jwtToken)
    response.send("user doesnot logged in")
    const {username} = jwt.verify(jwtToken, 'secretKey');
    request.username = username;
    next();
}



app.get('/', (request, response) => {
    response.send("wlecome to social media app");
})

app.post('/userApi/register', async (request, response) => {
    const {username, password} = request.body;
    if(!username){
        response.send("username already exists");
    }else{
        await bcrypt.hash(password, 10).then((hashedPassword) => {
            console.log(hashedPassword);
            response.send("user registered successfully");
        });
    }
})

app.post('/userApi/Login', async (request, response) => {
    const {username, password, hashedPassword} = request.body;
    if(!username){
        response.send("user not present");
    }
    else{
        const match = await bcrypt.compare(password, hashedPassword);
        if(match){
            const token = jwt.sign({
                    username: username
                }, 'secretKey', { expiresIn: '1h' });
            response.send(JSON.stringify({
                response: "user logged in successfully",
                token: token
            }));
        }else{
            response.send("incorrect password");
        }
    }
})

app.get('/userApi/followers', authMiddleware,  async (request, response) => {
    response.send(request.username);
})

app.get('/userApi/following', authMiddleware, async (request, response) => {
    response.send(request.username);
})

app.get('/userApi/posts', authMiddleware, async(request, response) => {
    //get all user posts
    response.send(request.username);
})

app.get('/userApi/posts/feed', authMiddleware, async(request, response)=> {
    //get all latest posts
    response.send(request.username);
})

app.post('/userApi/posts', authMiddleware, async(request, response) => {
    //create a post
    response.send(request.username);
})

app.get('/userApi/posts/:postId', authMiddleware, async(request, response) => {
    response.send(request.username);
})

app.post('/userApi/posts/:postId/reactions', authMiddleware, async(request, response) => {
    //create a reaction to the post
    response.send(request.username);
})

app.get('/userApi/posts/:postId/reactions', authMiddleware, async(request, response) => {
    //get all the people with their corresponding reactions for the post
    response.send(request.username);
})

app.post('/userApi/posts/:postId/replies', authMiddleware, async(request, response) => {
    //create a reply to the post
    response.send(request.username);
})

app.get('/userApi/posts/:postId/replies', authMiddleware, async(request, response) => {
    //get all the people with their corresponding replies for the post
    response.send(request.username);
})

app.listen(5000);