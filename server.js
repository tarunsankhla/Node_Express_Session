const express = reequire('express');
const bodyparser = require('body-parser');
const  session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const client = redis.createClient();
const app = express();
const router = express.Router();
 
var email = 'xyz@gmail.com';
var password = '1234pqr';

app.use(cookieParser());
app.use(session({
    secret:"MySecretKeyIstarun1234",
    store: new redisStore({host: 'localhost',client:client,ttl:260,port:6379}),
    saveUninitialized:false,
    resave:false,
    cookie:{maxAge:1000 * 60 * 60 * 24},
}))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

router.get('/',(req,res) => {
    sess = req.session;
    if(sess.email){
        return res.send("Welcome User <a href=\'/logout'>Click to Logout</a>");
    }
    res.sendFile('index.html');
});

router.post('/login',(req,res)=>{
    if(req.body.email == email && req.body.password == password)
    {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
    }
    else{
        res.send("Invalid credentials");
    }
});

router.get('/admin',(req,res)=>{
    sess = req.session;
    if(sess.email){
        res.write(`<h1>Welcome ${sess.email}</h1><br/>`)
        res.end(+'>Logout');
    }
    else{
        res.write("PLEASE LOGIN FRST");
        res.end(+'>Login');
    }
});


router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.use('/',router);

app.listen(process.env.PORT || 3000 ,()=>
{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})












