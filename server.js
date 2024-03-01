if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Importing Libraries
const nodemailer = require("nodemailer");
const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const initializePassport = require("./cfg/passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const User = require('./models/User'); 
const Product = require('./models/Post');




mongoose.connect('mongodb://127.0.0.1:27017/register', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
    

const app = express();

initializePassport(
    passport
    // async email => await User.findOne({ email: email }),
    // async id => await User.findById(id)
);

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/static", express.static('./static/'));


// Login Route
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
}))


const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru", 
    port: 465, 
    secure: true, 
    auth: {
        user: "alishtest@mail.ru", 
        pass: "i4mggetJWgA41VHJpNpv",
    },
});


// Registration Route
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            req.flash('error', 'A user with that email already exists.');
            res.redirect('/register');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username: name,
                email: email,
                password: hashedPassword
            });
            await newUser.save();

            await transporter.sendMail({
                from: '"Test" <alishtest@mail.ru>',
                to: email,
                subject: 'Registration Successful',
                html: '<h1>Hello,</h1><p>Your registration was successful.</p>',
            });

            req.flash('success', 'Registration successful. You can now log in.');
            res.redirect("/login");
        }
    } catch (e) {
        console.log(e);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect("/register");
    }
});

// Routes
app.get('/main', checkNotAuthenticated, (req, res) => {
    res.render("main.ejs")
})

app.get('/more', checkNotAuthenticated, (req, res) => {
    res.render("more.ejs")
})

app.get('/index', checkAuthenticated, (req, res) => {
    res.render("index.ejs", {name: req.user.name})
})

app.get('/post', checkAuthenticated, (req, res) => {
    res.render("post.ejs", {name: req.user.name})
})

app.get('/deletepost', checkAuthenticated, (req, res) => {
    res.render("deletepost.ejs", {name: req.user.name})
})

app.get('/updatepost', checkAuthenticated, (req, res) => {
    res.render("updatepost.ejs", {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    const messages = req.flash();
    res.render("login.ejs", { messages });
});


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})
// End Routes

app.delete("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/main');
    });
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/main");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/index");
    }
    next();
}

//posts
app.get('/', (req, res)=>{
    res.send('hello node api')
})

app.get('/blog', (req, res)=>{
    res.send('hello blog1')
})

app.get('/products', async(req, res)=>{
    try {
        const products = await Product.find({})
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/products', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.put('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.listen(3000);
