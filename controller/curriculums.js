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
  Curriculum.find({}, (err, data) => {
    const { page, category, search, sortBy } = req.query;

    var courses = [];

    courses = data;

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
};

const getCurriculumsById = (req, res) => {
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
};

const addCurriculum = async (req, res) => {
  console.log("req", req.body);

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
};

/* const likeCurriculum = async (req, res) => {
  let doc = await User.findOne({ uid: req.body.uid });

  let curr = null;

  if (doc) {
    curr = doc.curriculums.find((i) =>
      i["id"].includes(req.body.curriculum["id"])
    );
  }
  console.log(curr);

  res.send();
}; */

module.exports = {
  getCurriculums,
  getCurriculumsById,
  addCurriculum,
  Curriculum,
};
