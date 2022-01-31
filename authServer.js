import express from "express";
import jsonwebtoken from "jsonwebtoken";
const app = express();
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

let refreshTokens = [];

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = genAccessToken(user);
  const refreshToken = JWT.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = genAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function genAccessToken(user) {
  return JWT.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.listen(4000);
