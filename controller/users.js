const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { filtering } = require("../functions/filter");
const { Curriculum } = require("./curriculums");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  uid: {
    type: String,
    unique: true,
  },
  courses: {
    type: Array,
  },
  curriculums: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);

const getUsers = (req, res) => {
  try {
    User.find({}, (err, data) => {
      res.json(data);
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const getUserById = (req, res) => {
  try {
    User.find({}, (err, data) => {
      res.json(data.filter((item) => item.uid == req.params.id));
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const addUser = async (req, res) => {
  try {
    let doc = await User.findOne({ uid: req.body.uid });

    if (doc) {
      res.send();
    } else {
      const user = new User();
      user.uid = req.body.uid;
      user.name = req.body.name;
      user.email = req.body.email;
      user.courses;
      user.save();
      res.send();
    }
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const saveCourse = async (req, res) => {
  try {
    let doc = await User.findOne({ uid: req.body.uid });

    let includesCourse = null;

    if (doc) {
      includesCourse = doc.courses.some((i) =>
        i["Course Name"].includes(req.body.course["Course Name"])
      );
    }

    if (includesCourse) {
      User.findOneAndUpdate(
        { uid: req.body.uid },
        { $pull: { courses: req.body.course } },
        { new: true },
        (err, d) => {
          res.send(d);
        }
      );
    } else {
      User.findOneAndUpdate(
        { uid: req.body.uid },
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

const getSavedCourses = (req, res) => {
  try {
    User.find({ uid: req.body.uid }, (err, data) => {
      const { search, page } = req.body;

      var courses = [];

      const d = data[0];

      if (d) {
        courses = d.courses;
      }

      if (search) {
        courses = filtering(courses, {
          title: search,
        });
      }

      const length = courses.length;

      if (page) {
        courses = courses.slice(Number(page) * 12, (Number(page) + 1) * 12);
      }

      res.json({ courses, length });
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const saveCurriculum = async (req, res) => {
  try {
    let doc = await User.findOne({ uid: req.body.uid });

    let includesCourse = null;

    if (doc) {
      includesCourse = doc.curriculums.some((i) =>
        i["id"].includes(req.body.curriculum["id"])
      );
    }

    delete req.body.curriculum["likes"];
    console.log(req.body.curriculum);

    if (includesCourse) {
      let cur = await Curriculum.findOne({ id: req.body.curriculum["id"] });

      User.findOneAndUpdate(
        { uid: req.body.uid },
        { $pull: { curriculums: req.body.curriculum } },
        { new: true },
        (err, d) => {
          cur.likes = cur.likes - 1;
          cur.save();
          res.send({ curriculums: d.curriculums, likes: cur.likes });
        }
      );
    } else {
      let cur = await Curriculum.findOne({ id: req.body.curriculum["id"] });

      User.findOneAndUpdate(
        { uid: req.body.uid },
        { $push: { curriculums: req.body.curriculum } },
        { new: true },
        (err, d) => {
          cur.likes = cur.likes + 1;
          cur.save();
          res.send({ curriculums: d.curriculums, likes: cur.likes });
        }
      );
    }
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

const getSavedCurriculums = (req, res) => {
  try {
    User.find({ uid: req.body.uid }, (err, data) => {
      res.json(data[0].curriculums);
    });
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  saveCourse,
  saveCourse,
  getSavedCourses,
  saveCurriculum,
  getSavedCurriculums,
  User,
};
