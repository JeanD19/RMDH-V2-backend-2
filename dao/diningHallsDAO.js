import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let dining_halls

export default class DiningHallsDAO {
    static async injectDB(conn) {
        if(dining_halls) {
            return 
        }
        try {
            dining_halls = await conn
            .db(process.env.RATEDINING_NS)
            .collection("dining_halls");
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    //Method to get all the dining halls for a school
    static async getDiningHalls(school_id) {
        try {
            const dining_hallsDoc = {
                school_id: new ObjectId(school_id)
            };
            return await dining_halls.find(dining_hallsDoc).toArray();
        }
        catch (e) {
            console.error(`Unable to get dining halls: ${e}`);
            return { error: e };
        }
    }

    //Method to edit a dining hall's metric
    static async updateDiningHall(dining_id, review_grades){
        //Get the dining hall
        try{
            let dining_hall;
        
            const dining_hall_doc = {
            _id: new ObjectId(dining_id)
        }
            const response = await dining_halls.findOne(dining_hall_doc)
            dining_hall = response;

            const sum_categories = Object.values(review_grades).reduce((a, b) => a + b, 0);
            const review_grade = parseFloat((sum_categories / 7).toFixed(2));

            const updateDoc = {
                $inc: {
                    total_reviews: 1,
                    reviews_sum: review_grade,
                    ...Object.keys(review_grades).reduce((acc, key) => {
                        acc[`sub_ratings.${key}`] = review_grades[key];
                        return acc;
                    }, {})
                }
            }

            return await dining_halls.updateOne(dining_hall_doc, updateDoc)
            
        } catch(e) {
            console.error(`Unable to find the dining hall and update it: ${e}`);
            return { error: e };
        }
    }
}