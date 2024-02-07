import UsersDAO from '../dao/usersDAO.js';
//import { generateUsername } from 'unique-username-generator';
import pkg from 'unique-username-generator';
import bcrypt from 'bcrypt';
const { generateUsername } = pkg;

export default class UsersController {
    static async apiCreateUser(req, res, next) {
        try {
            
            const { university, year, email, password } = req.body;
            let username = '';

            // Create unique username
            username = generateUsername('_', 3, 15);

            //Check if the email is already taken
            let emailExists = await UsersDAO.checkEmail(email); //if true it will return the user document, else return null

            if (emailExists) {
                // Send an error message to the user
                res.status(400).json({message: 'Email already exists'});
                return;
            }

            // Check if the username is already taken
            let usernameExists = await UsersDAO.checkUsername(username); //if true it will return the user document, else return null

            while (usernameExists) {
                // Generate a new username
                username = generateUsername('_', 3, 15);
                usernameExists = await UsersDAO.checkUsername(username); //If it's false it will break 
            }

            // Hash the password
            let hashedPassword = await UsersController.hashPassword(password);


            const userResponse = await UsersDAO.addUser(username, university, year, email, hashedPassword);

            // Add user data to the session
            req.session.user = {
                user_id: userResponse.insertedId,
                username: username,
                university: university,
                year: year,
                email: email
            }
            //console.log(req.session.user);
            res.json({message: '200 Ok', user: req.session.user});
        } catch (error) {
            next(error);
        }
    }

    static async apiLogInUser(req, res, next) {
        try {
            const { email, password } = req.body;
            //console.log(req.body);

            const user = await UsersDAO.getUserByEmail(email);
            if (!user) {
                res.status(400).json({message: 'Invalid email, user not found!'});
                return;
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.status(400).json({message: 'Invalid password!'});
                return;
            }
            // Add user data to the session
            req.session.user = {
                user_id: user._id,
                username: user.username,
                university: user.university,
                year: user.year,
                email: user.email
            }
            res.json({message: '200 Ok', user: req.session.user});
        } catch(error) {
            next(error);
        }
    }

    static async hashPassword(password){
        const saltRounds = 10;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
