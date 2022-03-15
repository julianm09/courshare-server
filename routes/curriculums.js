const express = require("express");
const {
  getCurriculums,
  addCurriculum,
  getCurriculumsById,
  getCurriculumsByUid,
  addCourse,
} = require("../controller/curriculums");

const router = express.Router();

router.get("/curriculum", getCurriculums);

router.get("/curriculum/:id", getCurriculumsById);

router.get("/curriculum/uid/:id", getCurriculumsByUid);

router.post("/curriculum/add", addCurriculum);

router.post("/curriculum/addCourse", addCourse);

module.exports = router;
