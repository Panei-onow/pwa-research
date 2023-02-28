const express = require("express");

const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT , MONGO_IP, REDIS_URL, SESSION_SECRET, REDIS_PORT} = require("./config/config");
const session = require("express-session");
// const redis = require("redis");
// let RedisStore = require("connect-redis")(session);
// let redisClient = redis.createClient({
//     host: REDIS_URL,
//     port: REDIS_PORT,
// })


const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connectes to DB"))
    .catch((e) => { 
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

// app.use(session({
//     store: new RedisStore({ client: redisClient}),
//     secret: SESSION_SECRET,
//     cookie: {
//         secure: false,
//         resave: false,
//         saveUninitialized: false
//     }
// }));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.get("/api", (req,res) => {
    res.send("<h2> Hi There testing</h2>");
});


// localhost:300/api/v1/posts/
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/user", userRouter);


const port = process.env.PORT || 3000;

app.listen(port , ()=> console.log(`listening on port ${port}; `))