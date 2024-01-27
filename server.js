import express from 'express';
import cors from 'cors';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import schools from './api/schools.route.js';
import dinings from './api/dinings.route.js';
import reviews from './api/reviews.route.js';
import users from './api/users.route.js';
import session from 'express-session';
// import mongoose from 'mongoose';
// import connectMongoDBSession from 'connect-mongodb-session';
import MongoStore from 'connect-mongo';
import dotenv from "dotenv";

const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, //'http://localhost:3000'
  credentials: true
}));


// const MongoDBSession = connectMongoDBSession(session);

// const store = new MongoDBSession({
//   uri: process.env.RATEDINING_DB_URI,
//   collection: 'sessions'
// });

// mongoose.connect(process.env.RATEDINING_DB_URI, {
//   useNewUrlParser: true,
//   //useUnifiedTopology: true,
// }).then(res => {
//   console.log('MongoDB connected');
// }).catch(err => {
//   console.log('Failed to connect to MongoDB', err);
// });

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     secure: false, //set to true when deploying to production,
//     maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//   },
// }));

//Testing sessions
// app.get(`/`, (req, res) => {
//   //console.log(req.body);
//   req.session.isAuth = true;
//   console.log(req.session.id)
//   //res.json({ message: '200 Ok' });
//   res.json({ message: '200 Ok', session: req.session.id });
// });

//Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.RATEDINING_DB_URI }),
    cookie: {
        secure: true, //set to true when deploying to production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    unset: 'destroy'
}));

// Error handler function
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

//Testing sessions
app.get(`/`, (req, res) => {
  console.log(req.body);
  req.session.isAuth = true;
  console.log(req.session)
  //res.json({ message: '200 Ok' });
  res.send("Hello guys")
});


// Endpoint to get the session data (add to swagger)
app.get('/api/session', (req, res) => {
  if(req.session.id) {
    req.session.isLoggedIn = true;
    res.json({ isLoggedIn: true, user: req.session.user});
  } else{
    req.session.isLoggedIn = false;
    res.json({ isLoggedIn: false });
  }
});

// Endpoint to destroy the session (add to swagger)
app.delete('/api/session/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
          // Log the error and send a 500 response
          res.status(500).json({ message: 'Error destroying session', code: '500 Internal Server Error' });
        } else {
          // Send a 200 response
          res.json({ message: 'Session destroyed', code: '200 OK' });
        }
      });
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Endpoints for handling schools
app.use('/api/schools', schools);

//Endpoint for handling users
app.use('/api/users', users);

//Endpoint for handling dining halls
app.use('/api/dinings', dinings);

//Endpoint for handling reviews
app.use('/api/reviews', reviews);

app.get('/', (req, res) => {
  res.send('Hello World Guys!');
});

app.use("*", (req, res) => res.status(404).json({error: "not found"}));

export default app;