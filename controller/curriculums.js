const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { filtering } = require("../functions/filterCurriculums");
const { sortArr } = require("../functions/sort");
const { User } = require("./users");

const curriculumSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  username: {
    type: String,
  },
  uid: {
    type: String,
  },
  category: {
    type: String,
  },
  courses: {
    type: Array,
  },
  likes: {
    type: Number,
  },
});

const Curriculum = mongoose.model("Curriculum", curriculumSchema);

const getCurriculums = (req, res) => {
  try {
    Curriculum.find({}, (err, data) => {
      const { page, category, search, sortBy } = req.query;

      var courses = [];

      courses = data;

      courses = sortArr(courses, {
        key: "date",
        type: "desc",
      });

      if (category || search) {
        courses = filtering(data, {
          category: category,
          title: search,
        });
      }

      if (sortBy) {
        if (sortBy == "Top") {
          courses = sortArr(courses, {
            key: "likes",
            type: "desc",
          });
        }
        if (sortBy == "New") {
          courses = sortArr(courses, {
            key: "date",
            type: "desc",
          });
        }
      }

      const length = courses.length;

      if (page) {
        courses = courses.slice(Number(page) * 3, (Number(page) + 1) * 3);
      }

      res.json({ courses, length: length });
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const getCurriculumsById = (req, res) => {
  try {
    Curriculum.find({}, (err, data) => {
      res.json(data.filter((item) => item.id == req.params.id));
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const getCurriculumsByUid = (req, res) => {
  try {
    Curriculum.find({}, (err, data) => {
      const { page, category, search } = req.query;
      var courses = [];

      courses = data.filter((item) => item.uid == req.params.id);

      if (category || search) {
        courses = filtering(data, {
          category: category,
          title: search,
        });
      }

      const length = courses.length;

      if (page) {
        courses = courses.slice(Number(page) * 3, (Number(page) + 1) * 3);
      }

      res.json({ courses, length: length });
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const addCurriculum = async (req, res) => {
  try {
    const curriculum = new Curriculum();
    curriculum.id = uuidv4();
    curriculum.name = req.body.name;
    curriculum.date = new Date();

    curriculum.username = req.body.username;
    curriculum.uid = req.body.uid;

    curriculum.category = req.body.category;
    curriculum.courses = [req.body.course];

    curriculum.likes = 0;

    curriculum.save();
    res.send();
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const addCourse = async (req, res) => {
  try {
    let doc = await Curriculum.findOne({ id: req.body.id });

    let includesCourse = null;

    if (doc) {
      includesCourse = doc.courses.some((i) =>
        i["Course Name"].includes(req.body.course["Course Name"])
      );
    }

    if (includesCourse) {
      res.send();
    } else {
      Curriculum.findOneAndUpdate(
        { id: req.body.id },
        { $push: { courses: req.body.course } },
        { new: true },
        (err, d) => {
          res.send(d);
        }
      );
    }
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

module.exports = {
  getCurriculums,
  getCurriculumsById,
  getCurriculumsByUid,
  addCurriculum,
  Curriculum,
  addCourse,
};
