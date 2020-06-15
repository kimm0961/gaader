require('dotenv').config()

const express = require('express')
var session = require('express-session')
var cors = require('cors')
const app = express()

// Heroku
var FileStore = require('session-file-store')(session);
var FileStoreOptions = {};

app.set('trust proxy', 1);

// for at bruge mongo som store for session - isf hukommelsen som ikke dur på fx heroku
const MongoStore = require('connect-mongo')(session);


const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    NODE_ENV = 'development',
    PORT = 5030,
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

// Mongoose og DB
const mongoose = require('mongoose')

// // Localhost-databasen:
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// Atlas-databasen (remote)
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


// App use

app.use(cors()); // HUSK DENNE
app.use('/public',express.static('public')); // statiske filer - upload billder til backend
app.use(express.json()) // nødevndig når post data er i json
app.use(express.urlencoded({extended: true})) // ellers er req.body undefined eller tom

// Session
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(fileStoreOptions),
    store: new MongoStore({mongooseConnection: db}),
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))

//route indeholder ordet admin

app.use('*/admin', (req, res, next) => {

    // hvis der ikke er en session
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Du har ikke adgang - skal være logget ind'})
    }

    // hvis der er en session... så bare fortsæt arbejdet
    next();
})

// Routes

const brugerRouter = require('./routes/bruger')
app.use('/admin/bruger', brugerRouter)

const gaaderRouter = require('./routes/gaader')
app.use('/gaader', gaaderRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// PORT

app.listen(PORT, () => console.log('Server Started' + PORT))