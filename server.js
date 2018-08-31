const express = require("express");
const Router = require("koa-router");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

//**** 몽고디비 연결 부분  ****//
const User = require("./models/User");
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  // Connected to MongoDB server
  console.log("Connected to mongod server");
});

mongoose.connect(
  "mongodb://localhost/devlog",
  { useNewUrlParser: true }
);

app.get("/", (req, res) => {
  console.log("this on GET /");
  res.send(`this on GET /`);
});

// SELECT 전체 유저
app.get("/api/users", (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(500).send({ Error: "database failure" });
    }
    console.log(users);
  }).then(users => {
    res.send(users);
  });
});

// SELECT 유저 1명
app.get("/api/users/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user)
      return res
        .status(404)
        .json({ error: `${req.params.email} is not found` });
    res.json(user);
  });
});

// INSERT 유저 추가
app.post("/api/users", (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.nickname = req.body.nickname;

  user.save(err => {
    if (err) return res.status(500).json({ result: 0 });
    res.json({ result: 1 });
  });
});

// UPDATE 유저 정보 수정
app.put("api/users/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) return res.status(500).json({ error: "database failure" });
    if (!user) return res.status(404).json({ error: "user not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.nickname) user.nickname = req.body.nickname;

    user.save(err => {
      if (err) return res.status(500).json({ error: "failed to update" });
      res.json({ message: "user updated!" });
    });
  });
});

// DELETE 유저 삭제
app.delete("/api/users/:email", (req, res) => {
  User.remove({ email: req.params.email }, (err, output) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (!output.n) return res.status(404).send({ error: "user not found" });
    res.json({ message: "user deleted" });
  });
});

// UPDATE 포스트 작성
app.put("/api/posts/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) return res.status(500).json({ error: "database failure" });
    if (!user) return res.status(404).json({ error: "user not found" });

    if (req.body.title) user.posts.title = req.body.title;
    if (req.body.content) user.posts.content = req.body.content;
    if (req.body.regdate) user.posts.regdate = req.body.regdate;
    if (req.body.maintag) user.posts.maintag = req.body.maintag;
    if (req.body.register) user.posts.register = req.body.register;

    user.save(err => {
      if (err) return res.status(500).json({ error: "post insert fail" });
      res.json({ message: "post insert success" });
    });
  });
});

app.listen(port, () => console.log(`Server Listening on PORT ${port}`));
