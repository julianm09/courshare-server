const express = require("express");
const {
  getUsers,
  getUserById,
  addUser,
  saveCourse,
  getSavedCourses,
  saveCurriculum,
  getSavedCurriculums,
} = require("../controller/users");

const router = express.Router();

router.get("/user", getUsers);

router.get("/user/:id", getUserById);

router.post("/user/add", addUser);

router.post("/user/saveCourse", saveCourse);

router.post("/user/getSavedCourses", getSavedCourses);

router.post("/user/saveCurriculum", saveCurriculum);

router.post("/user/getSavedCurriculums", getSavedCurriculums);

module.exports = router;
