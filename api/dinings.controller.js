import DiningHallsDAO from "../dao/diningHallsDAO.js";

export default class DiningsController {

    static async apiGetDinings(req, res, next) {
        try {
            let diningsList = await DiningHallsDAO.getDiningHalls(req.query.school_id);

            let response = {
                dining_halls: diningsList,
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}