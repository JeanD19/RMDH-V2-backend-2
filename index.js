import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import SchoolsDAO from "./dao/schoolsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import DiningDAO from "./dao/diningHallsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";


dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 3001;
console.log(process.env.RATEDINING_DB_URI);
console.log(port);

MongoClient.connect(process.env.RATEDINING_DB_URI, {
  maxPoolSize: 500,
  wtimeoutMS: 2500,
  useUnifiedTopology: true
})
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await SchoolsDAO.injectDB(client) //inject the DB connection to the DAO
    await UsersDAO.injectDB(client) //inject the DB connection to the DAO
    await DiningDAO.injectDB(client) //inject the DB connection to the DAO
    await ReviewsDAO.injectDB(client) //inject the DB connection to the DAO
    
    app.listen(port, () => {
      console.log(`Connected to all the DBs`);
      console.log(`listening on port ${port}`);
    });
  });
