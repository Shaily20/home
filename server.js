const express = require('express');
let bodyParser=require('body-parser');

const app=express();
let db = require('./db/db');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const session=require('express-session');
const cookieParser=require('cookie-parser');
//const userconfig=require('./userconfig.json');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';
const path=require('path');
let un,pw;

app.set('views', path.join(__dirname, 'view1'));
app.set('views engine', 'hbs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', express.static('public'));
//app.use(express.static(path.join(__dirname, 'public1')));

app.use(cookieParser());
app.use(session({secret:'cat is here'}));
app.use(passport.initialize());
app.use(passport.session());

/*app.get('/login',function () {
    res.render('login.hbs');
});*/

app.post('/login',
    passport.authenticate('local',
        { successRedirect: '/success',
        failureRedirect: '/log' }));

passport.use(new LocalStrategy(

    function (username,password,done) {
        un=username;
        console.log(username);
        console.log(password);
        console.log("1");
        db.isEqualuser(username,function (data,id) {
            console.log("2");
            if(username!==data)
            {
                console.log("3");
                return done(null,false,{message:"username is not verified."});
            }
            else if(username===data){
                db.isEqualpass(id,password,function (data) {
                    console.log("4");
                    if(password!==data)
                    {
                        console.log("5");
                        return done(null,false,{message:"password is incorrect."});
                    }
                    else
                    {
                        console.log("6");
                        return done(null,username);
                    }
                });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id,done) {
    done(null,id);
});

app.post('/signup',function (req,res) {

    var username=req.body.username;
    var password=req.body.password;
    /*bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            db.add(username,hash,function (data) {
                console.log(data);
            });
        });
    });*/
    db.add(username,password,function (data) {
        console.log(data);
    });

    res.sendFile('sd.html', {root : __dirname + '/views'});

});

app.get('/log',function (req,res) {
    res.send("Hello")
});

app.get('/success',function (req,res) {

    res.sendFile('sd.html', {root : __dirname + '/views'});
});

app.listen(5000,function () {
    console.log("Server is running on port 5000.");
    db.connect();
});