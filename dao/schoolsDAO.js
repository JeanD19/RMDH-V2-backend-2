import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let schools;

export default class SchoolsDAO {
  //Method to connect to DB right when the server runs
  static async injectDB(conn) {
    if (schools) {
      return;
    }
    try {
      schools = await conn
        .db(process.env.RATEDINING_NS)
        .collection("Schools");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in schoolsDAO: ${e}`
      );
    }
  }

  // Method to get all the schools (this would be displayed on a page)
  static async getSchools({
    filters = null,
    page = 0,
    schoolsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    // Cursor for MongoDB fetching
    let cursor;

    try {
      cursor = await schools.find(query);
    } catch (e) {
      return { schoolsList: [], totalNumSchools: 0 };
    }

    const displayCursor = cursor
      .limit(schoolsPerPage)
      .skip((schoolsPerPage * page));

    try {
      const schoolsList = await displayCursor.toArray();
      const totalNumSchools = await schools.countDocuments(query);

      return { schoolsList, totalNumSchools };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { schoolsList: [], totalNumSchools: 0 };
    }
  }

  static async getSchoolsByName(name) {
    let query = { name: { $regex: name, $options: "i" } };
    let cursor;

    try {
      cursor = await schools.find(query);
    } catch (e) {
      console.log(`Unable to issue find command, ${e}`);
      return { schoolsList: [] };
    }

    try {
      const schoolsList = await cursor.toArray();
      return { schoolsList };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { schoolsList: [] };
    }
  }

}