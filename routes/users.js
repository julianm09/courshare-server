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

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/user", getUsers);

// This section will help you get a single record by id
router.get("/user/:id", getUserById);

// This section will help you create a new record.
router.post("/user/add", addUser);

// This section will help you create a new record.
router.post("/user/saveCourse", saveCourse);

// This section will help you create a new record.
router.post("/user/getSavedCourses", getSavedCourses);

// This section will help you create a new record.
router.post("/user/saveCurriculum", saveCurriculum);

// This section will help you create a new record.
router.post("/user/getSavedCurriculums", getSavedCurriculums);

module.exports = router;
