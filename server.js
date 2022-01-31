import express from "express";
import jsonwebtoken from "jsonwebtoken";
const app = express();
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

const posts = [
  {
    username: "bob",
    title: "My first post",
  },
  {
    username: "jane",
    title: "My second post",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = JWT.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

function authenticateToken(req, res, next) {
  // Bearer [TOKEN]
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
