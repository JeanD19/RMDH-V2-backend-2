import SchoolsDAO from "../dao/schoolsDAO.js";

export default class SchoolsController {

    static async apiGetSchools(req, res, next) {
        try {
            const { schoolsPerPage = 20, page = 0, name } = req.query;

            const schoolsPerPageNum = parseInt(schoolsPerPage, 10);
            const pageNum = parseInt(page, 10);

            // Validate schoolsPerPage and page
            if (isNaN(schoolsPerPageNum) || isNaN(pageNum)) {
                res.status(400).json({ error: 'Invalid page or schoolsPerPage parameter' });
                return;
            }

            let filters = {};
            if (name) {
                filters.name = name;
            }

            const { schoolsList, totalNumSchools } = await SchoolsDAO.getSchools({
                filters,
                page: pageNum,
                schoolsPerPage: schoolsPerPageNum,
            });

            let response = {
                schools: schoolsList,
                page: pageNum,
                filters: filters,
                entries_per_page: schoolsPerPageNum,
                total_results: totalNumSchools,
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async apiGetSchoolsByName(req, res, next) {
        try {
            let schoolsList = await SchoolsDAO.getSchoolsByName(req.query.name);
            let response = {
                schools: schoolsList,
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}