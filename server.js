import express from 'express';
import cors from 'cors';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import schools from './api/schools.route.js';
import dinings from './api/dinings.route.js';
import reviews from './api/reviews.route.js';
import users from './api/users.route.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from "dotenv";

const swaggerDocument = YAML.load('./openapi.yaml');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

dotenv.config();

//Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.RATEDINING_DB_URI }),
    cookie: {
        secure: false, //set to true when deploying to production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    unset: 'destroy'
}));

// Error handler function
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


// Endpoint to get the session data (add to swagger)
app.get('/api/session', (req, res) => {
  if(req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user});
  } else{
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
  res.send('Hello World!');
});

app.use("*", (req, res) => res.status(404).json({error: "not found"}));

export default app;
