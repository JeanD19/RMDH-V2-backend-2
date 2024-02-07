import ReviewsDAO from "../dao/reviewsDAO.js";
import UsersDAO from '../dao/usersDAO.js';
import DiningHallsDAO from '../dao/diningHallsDAO.js'
import pkg from 'unique-username-generator';

const { generateUsername } = pkg;


export default class ReviewsController {

    static async apiGetReviews(req, res, next) {
        try {
            //console.log('About to search for reviews for a dining hall')
            let reviewsList = await ReviewsDAO.getReviews(req.query.dining_id);
            // if(diningsList.length === 0) {
            //     res.json({message: 'No dining halls for this school yet...'})
            //     return;
            // }
            let response = {
                reviews: reviewsList,
            };
            //console.log(response)
            res.json(response);
        } catch (error) {
            //next(error);
            console.log(error)
        }
    }

    static async apiAddReview(req, res, next){
        try{
            //console.log('Adding a review to the reviews collection');
            //console.log(req.body);
            const {username, year, text_review, grades, dining_id} = req.body;
            let user = '';
            //if username is null, user not identified
            //console.log(`The username for this review: ${username.username}`);
            if(username == null){
                user = generateUsername('_', 3, 15);
                let usernameExists = await UsersDAO.checkUsername(username);
                
                //check if it exist already
                while (usernameExists) {
                    // Generate a new username
                    user = generateUsername('_', 3, 15);
                    console.log(`The randomly generated username is ${username}`);
                    usernameExists = await UsersDAO.checkUsername(username); //If it's false it will break 
                }
            }
            else {
                user = username.username;
            }

            // Generate the date
            const date_obj = new Date()
            const today_format = date_obj.toISOString()

            //console.log(today_format)

            //Change all the strings of the grades to decimal
            const gradesInt = Object.entries(grades).reduce((acc, [key, value]) => {
                acc[key] = parseInt(value);
                return acc;
            }, {});

            //console.log(gradesInt)

            const response = await ReviewsDAO.addReview(dining_id, user, year, today_format, gradesInt, text_review);

            if(response.acknowledged){
                //Modify the dining hall metric total_reviews & reviews_sum
                //console.log('Added the review, now updating the dining hall metrics')
                const response2 = await DiningHallsDAO.updateDiningHall(dining_id, gradesInt)

                if(response2.error){
                    //console.error(`Error updating dining hall: ${response2.error}`);
                    res.json({error: response2.error});
                }

                res.json({response})
            }
        } catch(error){
            console.log(error);
            next(error);
        }
    }
}