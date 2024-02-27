import UsersDAO from '../dao/usersDAO.js';
//import { generateUsername } from 'unique-username-generator';
import pkg from 'unique-username-generator';
import bcrypt from 'bcrypt';
const { generateUsername } = pkg;
const {uniqueUsernameGenerator} = pkg;
import { generateUsername } from 'friendly-username-generator';

export default class UsersController {
    static async apiCreateUser(req, res, next) {

        const adjectives = [
            "Kindhearted", "Gentle", "Loving", "Caring", "Compassionate", "Tender", "Warmhearted", "Affectionate", 
            "Generous", "Considerate", "Empathetic", "Sympathetic", "Nurturing", "Thoughtful", "Sincere", "Gracious", 
            "Understanding", "Supportive", "Encouraging", "Friendly", "Hospitable", "Radiant", "Sweet", "Genuine", 
            "Pleasant", "Cheerful", "Joyful", "Happy", "Delightful", "Positive", "Bright", "Sunny", "Lighthearted", 
            "Bubbly", "Jovial", "Optimistic", "Uplifting", "Enthusiastic", "Energetic", "Vibrant", "Spirited", 
            "Inspiring", "Motivating", "Heartwarming", "Endearing", "Adorable", "Charming", "Darling", "Amiable", 
            "Winsome", "Pleasant", "Agreeable", "Alluring", "Attractive", "Beautiful", "Graceful", "Lovely", "Angelic", 
            "Serene", "Peaceful", "Tranquil", "Calm", "Soothing", "Relaxing", "Serene", "Blissful", "Content", 
            "Fulfilling", "Gratifying", "Satisfying", "Joyous", "Gleeful", "Merry", "Playful", "Fun-loving", 
            "Whimsical", "Magical", "Enchanting", "Captivating", "Fascinating", "Alluring", "Spellbinding", 
            "Charismatic", "Magnetic", "Irresistible", "Inviting", "Welcoming", "Homely", "Cozy", "Snug", 
            "Comforting", "Invigorating", "Refreshing", "Restorative", "Revitalizing", "Rejuvenating", "Energizing", 
            "Empowering", "Strengthening", "Nourishing", "Wholesome", "Healthy", "Hearty", "Robust", "Flourishing", 
            "Vital", "Dynamic", "Lively", "Spirited", "Agile", "Sprightly", "Peppy", "Zesty", "Vigorous", "Resilient", 
            "Hardy", "Sturdy", "Tough", "Tenacious", "Durable", "Reliable", "Trustworthy", "Steadfast", "Loyal", 
            "Devoted", "Committed", "Dedicated", "Faithful", "True-hearted", "Genuine", "Authentic", "Real", "Honest", 
            "Sincere", "Trustworthy", "Dependable", "Reliable", "Steadfast", "Stalwart", "Solid", "Unwavering", 
            "Rock-solid", "Consistent", "Persistent", "Determined", "Diligent", "Hardworking", "Industrious", "Assiduous", 
            "Conscientious", "Tireless", "Patient", "Persevering", "Enduring", "Tenacious", "Resolute", "Strong-willed", 
            "Intrepid", "Courageous", "Brave", "Fearless", "Bold", "Daring", "Valiant", "Heroic", "Noble", "Gallant", 
            "Magnanimous", "Benevolent", "Altruistic", "Selfless", "Philanthropic", "Charitable", "Giving", "Sacrificing", 
            "Thoughtful", "Considerate", "Kindhearted", "Compassionate", "Empathetic", "Understanding", "Supportive", 
            "Encouraging", "Nurturing", "Protective", "Guardian-like", "Uplifting", "Inspiring", "Motivating", 
            "Enthusiastic", "Positive", "Optimistic", "Hopeful", "Cheerful", "Joyful", "Grateful", "Appreciative", "Thankful", 
            "Content", "Fulfilled"
        ]

        const animal_names = [
            'Alligator', 'Alpaca', 'Anteater', 'Antelope', 'Armadillo', 'Barracuda', 'Beaver', 'Beetle', 'Bluebird', 'Bluejay', 'Butterfly',
            'Caterpillar', 'Cheetah', 'Chimpanzee', 'Chinchilla', 'Chipmunk', 'Cockroach', 'Coyote', 'Dalmatian', 'Dolphin', 'Dragonfly', 
            'Eagle', 'Echidna', 'Elephant', 'Firefly', 'Flamingo', 'Gazelle', 'Gibbon', 'Giraffe', 'Goldfish', 'Gorilla', 'Grasshopper',
            'Hamster', 'Hedgehog', 'Hippopotamus', 'Hummingbird', 'Jellyfish', 'Kangaroo', 'Koala', 'Ladybug', 'Lemur', 'Lobster', 'Marmot',
            'Manatee', 'Meerkat', 'Mongoose', 'Octopus', 'Ocelot', 'Orangutan', 'Ostrich', 'Pangolin', 'Peacock', 'Penguin', 'Piranha', 
            'Platypus', 'Pony', 'Porcupine', 'Porpoise', 'Praying_Mantis', 'Puffin', 'Raccoon', 'Rattlesnake', 'Red_Panda', 'Rhinoceros', 
            'Salamander', 'Scorpion', 'Sea_Lion', 'Seahorse', 'Snow_Leopard', 'Sparrow', 'Squirrel', 'Starfish', 'Tarantula', 'Tiger', 'Tortoise',
            'Toucan', 'Wallaby', 'Walrus', 'Whale_Shark', 'Woodchuck', 'Woodpecker'
        ]

        try {
            
            const { university, year, email, password } = req.body;
            
            let username = '';
            
            const config = {
                dictionaries: [adjectives, animal_names],
                seperator: '_',
                style: 'capital',
                randomDigits: 3
            }
            //username = uniqueUsernameGenerator(config);
            username = generateUsername();
            console.log(username);
            // Create unique username
            //username = generateUsername('_', 3, 15);


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
                //username = generateUsername('_', 3, 15);
                username = generateUsername();
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
