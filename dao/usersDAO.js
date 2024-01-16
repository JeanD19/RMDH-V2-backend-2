import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO {
  //Method to connect to DB right when the server runs
    static async injectDB(conn) {
        if (users) {
        return;
        }
        try {
        users = await conn
            .db(process.env.RATEDINING_NS)
            .collection("Users");
        } catch (e) {
        console.error(
            `Unable to establish a collection handle in UsersDAO: ${e}`
        );
        }
    }

  //Method to add a user to the DB
    static async addUser(username, university, year, email, password) {
        try {
            const userDoc = {
                username: username,
                university: university, 
                year: year, 
                email: email, 
                password: password 
            };
            return await users.insertOne(userDoc);
        } catch (e) {
        console.error(`Unable to add user: ${e}`);
        return { error: e };
        }
    }

    //Method to get a user by their email
    static async getUserByEmail(email) {
        try {
            const userDoc = {
                email: email
            };
            return await users.findOne(userDoc);
        } catch (e) {
        console.error(`Unable to get user: ${e}`);
        return { error: e };
        }
    }

    //Method to check if the username exists
    static async checkUsername(username) {
        try {
            const userDoc = {
                username: username
            };
            return await users.findOne(userDoc);
        } catch (e) {
        console.error(`Unable to check username: ${e}`);
        return { error: e };
        }
    }

    //Method to check if email exists
    static async checkEmail(email) {
        try {
            const userDoc = {
                email: email
            };
            return await users.findOne(userDoc);
        } catch (e) {
        console.error(`Unable to check email: ${e}`);
        return { error: e };
        }
    }

}