const express = reequire('express');
const bodyparser = require('body-parser');
const  session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
const app = express();
const router = express.Router();

app.use(session({
    secret:"tarun1234",
    store: new redisStore({host: 'localhost',client:client,ttl:260,port:6379}),
    saveUninitialized:false,
    resave:false
}))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

router.get('/',(req,res) => {
    sess = req.session;
    if(sess.email){
        return res.redirect('/admin');
    }
    res.sendFile('index.html');
});

router.post('/login',(req,res)=>{
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
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












