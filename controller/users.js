const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
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
  User.find({}, (err, data) => {
    res.json(data);
  });
};

const getUserById = (req, res) => {
  User.find({}, (err, data) => {
    res.json(data.filter((item) => item.uid == req.params.id));
  });
};

const addUser = async (req, res) => {
  console.log("req", req.body);

  let doc = await User.findOne({ uid: req.body.uid });

  if (doc) {
    res.send();
  } else {
    const user = new User();
    user.uid = req.body.uid;
    user.name = req.body.name;
    user.email = req.body.email;
    user.courses = [req.body.course];
    user.save();
    res.send();
  }
};

const saveCourse = async (req, res) => {
  let doc = await User.findOne({ uid: req.body.uid });

  let includesCourse = null;

  if (doc) {
    includesCourse = doc.courses.some((i) =>
      i["Course Name"].includes(req.body.course["Course Name"])
    );
  }

  //update

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
};

const getSavedCourses = (req, res) => {
  User.find({ uid: req.body.uid }, (err, data) => {
    res.json(data[0].courses);
  });
};

const saveCurriculum = async (req, res) => {
  let doc = await User.findOne({ uid: req.body.uid });

  let includesCourse = null;

  if (doc) {
    includesCourse = doc.curriculums.some((i) =>
      i["id"].includes(req.body.curriculum["id"])
    );
  }

  if (includesCourse) {
    let doc = await Curriculum.findOne({ id: req.body.curriculum.id });

    /*     doc.likes -= 1;
    doc.save(); */

    User.findOneAndUpdate(
      { uid: req.body.uid },
      { $pull: { curriculums: req.body.curriculum } },
      { new: true },
      (err, d) => {
        res.send(d);
      }
    );
  } else {
    let doc = await Curriculum.findOne({ id: req.body.curriculum.id });

    /*     doc.likes += 1;
    doc.save(); */

    User.findOneAndUpdate(
      { uid: req.body.uid },
      { $push: { curriculums: req.body.curriculum } },
      { new: true },
      (err, d) => {
        res.send(d);
      }
    );
  }
};

const getSavedCurriculums = (req, res) => {
  User.find({ uid: req.body.uid }, (err, data) => {
    res.json(data[0].curriculums);
  });
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
