const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv=require("dotenv")

dotenv.config()



const app = express();

app.use(express.json());

let client = null;

const initializeDbAndServer = async () => {
  const uri =process.env.MONGO_URI
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    app.listen(5000, () =>
      console.log(`Server Running at http://localhost:${5000}/`)
    );
    await client.connect(async (err) => {
      console.log("Database Started");
      apiServices(client);
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
  } finally {
    console.log("Database closed");
    await client.close();
  }
};

initializeDbAndServer();

/*const initializedBandServer = async () => {
    const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
 client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

    async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect(async( ) => {
            console.log("database started");
            app.listen(5000);
            apiServices();
        });
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch (error){
        console.log(`DB error: ${error} `);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }
}

initializedBandServer();*/


const addUserDetails = async (userDetails) => {
    await client.db("socialMedia").collection("User").insertOne(userDetails);
}

const addFollower = async (connctionDetails) => {
    await client.db("socialMedia").collection("follower").insertOne(connctionDetails);
}

const createPost = async (postDetails) => {
    await client.db("socialMedia").collection("post").insertOne(postDetails);
}

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



const apiServices  = () => {
    app.get('/', (request, response) => {
    response.send("wlecome to social media app");
})

app.post('/userApi/register', async (request, response) => {
    const {username, name, email, password} = request.body;
    let result = await client.db("socialMedia").collection("User").find({ $or: [{username: username}, {email: email} ] });
    console.log(result);
    result = await result.toArray();
    if(result.length !==0){
        response.send("user already exists");
    }else{
        await bcrypt.hash(password, 10).then((hashedPassword) => {
            let userDetails = {
                username: username,
                name: name,
                email: email,
                password: hashedPassword,
                followers: 0,
                following: 0
            }
            addUserDetails(userDetails);
            console.log(hashedPassword);
            response.send("user registered successfully");
        });
    }
})

app.post('/userApi/Login', async (request, response) => {
    const {username, password} = request.body;
    let result = await client.db("socialMedia").collection("User").find({username: username});
    result = await result.toArray();
    if(result.length===0){
        response.send("user not present");
    }
    else{
        const match = await bcrypt.compare(password, result[0].password);
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


app.post('/userApi/follow-connection', authMiddleware, async (request, response) => {
    const {following} = request.body;
    const connectionDetails = {
        follower: request.username,
        following: following
    };
    await addFollower(connectionDetails);
    response.send("follow-request successfull");
})

app.get('/userApi/followers', authMiddleware,  async (request, response) => {
    let result  = await client.db("socialMedia").collection("follower").find({following : request.username}, {follower: 1});
    result = await result.toArray();
    response.send(result);
})

app.get('/userApi/following', authMiddleware, async (request, response) => {
    let result = await client.db("socialMedia").collection("follower").find({follower: request.username}, {following: 1});
    result = await result.toArray();
    response.send(result);
})

app.get('/userApi/posts', authMiddleware, async(request, response) => {
    let result = await client.db("socialMedia").collection("post").find({createdBy: request.username});
    result = await result.toArray();
    //get all user posts
    response.send(result);
})

app.get('/userApi/posts/feed', authMiddleware, async(request, response)=> {
    //get all latest posts
    let followingList = await client.db("socialMedia").collection("follower").find({follower: request.username}, {$following: 1});
    followingList = await followingList.toArray();
    console.log(followingList);
    let result = await client.db("socialMedia").collection("post").find({createdBy: { $in : "zyx" }}).sort({$date : -1}).limit(10);
    result = await result.toArray();
    response.send(request.username);
})

app.post('/userApi/posts', authMiddleware, async(request, response) => {
    //create a post
    const {content} = request.body;
    postDetails = {
        content: content,
        createdBy: request.username,
        date: new Date()
    }
    await createPost(postDetails);
    response.send("post created");
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

}