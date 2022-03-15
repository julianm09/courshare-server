const express = require("express");
const {
  getCurriculums,
  addCurriculum,
  getCurriculumsById,
} = require("../controller/curriculums");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/curriculum", getCurriculums);

router.get("/curriculum/:id", getCurriculumsById);

router.post("/curriculum/add", addCurriculum);

module.exports = router;
