const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 8080;

/**  Cluster Mongo Atlas */
/*let dev_db_url = 'mongodb://clement:iblesstherainsdowninAfrica@cluster0-shard-00-00-nmcpw.mongodb.net:27017,cluster0-shard-00-01-nmcpw.mongodb.net:27017,cluster0-shard-00-02-nmcpw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));*/

require('./models/User');
require('./models/Quizz');


/*Local Mongodb*/
mongoose.connect(`mongodb://localhost:27017/KizzDatabase`, {
    useNewUrlParser: true
}, (err) => {
    if (err) throw err;
    console.log('Succesfully connected');
});

const routes = require('./routes/users');
const quizzRoutes = require('./routes/quizz/index')(io);
const usersRoutes = require('./routes/users');

app.set('view engine', 'ejs');

app.use(expressSession({
    secret: 'iBlessTheRainsDownInAfrica',
    resave: false,
    saveUninitialized: false
}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use((req, res, next) => {
    next();
});

app.use('/', routes);
app.use('/users', usersRoutes);
app.use('/quizz', quizzRoutes);


http.listen(port, () => console.log(`App listening at http://127.0.0.1:${port}`));

app.get('/', (req, res, next) => {
    res.render('home', {
        user: req.user
    });
});