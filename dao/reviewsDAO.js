import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if(reviews) {
            return 
        }
        try {
            reviews = await conn
            .db(process.env.RATEDINING_NS)
            .collection("reviews");
        } catch (e) {
            console.error(`Unable to establish collection handles in reviewsDAO: ${e}`)
        }
    }

    //Method to get all the reviews for a dining hall
    static async getReviews(dining_id) {
        try {
            const reviewsDoc = {
                dining_id: new ObjectId(dining_id)
            };
            return await reviews.find(reviewsDoc).toArray();
        }
        catch (e) {
            console.error(`Unable to get reviews: ${e}`);
            return { error: e };
        }
    }
    
    //Method to add a review to MongoDB collection
    static async addReview(dining_id, username, year, date, grades, text_review){
       try{
            const reviewDoc = {
                dining_id: new ObjectId(dining_id),
                username: username,
                year: year,
                date: date,
                ratings: grades,
                text_review: text_review
            };

            return await reviews.insertOne(reviewDoc);
       }  catch(e) {
        console.error(`Unable to add review: ${e}`);
        return { error: e };
       }
    }
}