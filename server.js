const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")
const methodOverride = require("method-override");

const PORT = process.env.PORT || 3000;

const MongoStore = require('connect-mongo');

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
  
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => { 
  const user = req.session.user;
  console.log(user);
  
  res.render('index.ejs', {user});
})

app.get('/error', (req, res) => {
  res.render('error.ejs');
})

const authController = require('./controllers/auth');
app.use('/auth', authController);

const isSignedIn = require('./middleware/is-signed-in');
app.use(isSignedIn);

const userController = require('./controllers/user');
const { CLIENT_RENEG_WINDOW } = require("tls");
const { log } = require("console");
app.use('/users', userController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

