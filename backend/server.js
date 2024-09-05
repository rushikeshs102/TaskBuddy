import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import logger from "./logger/logger.js";


dotenv.config({
  path: "./.env"
})

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB_DATABASE,
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (name, email ,password) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {

    if (err) {

      logger.error(`Error in creating user`);
      return res.json("Error in creating user");
    }
    logger.info(`User created successfully`);
    return res.json(data);
  });
});

app.post("/signin", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      // console.log(err)
      logger.error(`Error in signin`);
      return res.json("Error");
    }
    if (data.length > 0) {
      const id = data[0].id;
      const name = data[0].name;
      const email = data[0].email;
      const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      logger.info(`user Registered`)
      return res.json({ Status: "Success" });
    } else {
      logger.error(`Invalid Credentials`);
      return res.json("Fail");
    }
  });
});

// Middleware to verify the token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ Error: "No token found" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ Error: "Token is not valid" });
    // console.log("Decoded JWT payload:", decoded);
    req.name = decoded.name;
    req.email = decoded.email;
    // console.log("User ID:", req.email);
    req.userId = decoded.id;
    // console.log("User ID:", req.userId);
    next();
  });
};

app.post("/addtask", verifyUser, (req, res) => {
  const { title, desc } = req.body;

  const sql = "INSERT INTO tasks (UserID, Title, Description) VALUES (?, ?, ?)";
  // console.log(req.userId)
  const values = [req.userId, title, desc];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error adding task");
      return res.status(500).json({ Error: "Failed to add task" });
    }else{
      logger.info(`Task Added`)
      return res.status(200).json({ Status: "Task added successfully" });
    }
  });
});

app.get("/tasks", verifyUser, (req, res) => {
  const status = req.query.status;
  let sql = "SELECT * FROM tasks WHERE UserID = ?";
  const values = [req.userId];

  const data = db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      logger.error(`Error in fetching tasks`);
      return res.status(500).json({ Error: "Failed to fetch tasks" });
    }else{
      logger.info(`Tasks fetched successfully`);
      // console.log(data)
      return res.status(200).json(data);
    }
  });
});


app.delete("/tasks/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  // console.log("delete id" ,id)
  if (!id) {
    return res.status(400).json({ Error: "Task ID is required" });
  }
  const sql = "DELETE FROM tasks WHERE TaskID = ? AND UserID = ?";
  db.query(sql, [id, req.userId], (err, data) => {
    if (err) {
      console.error("Error deleting task:", err);
      logger.error(`Error in deleting task`);
      return res.status(500).json({ Error: "Failed to delete task" });
    }else{
      logger.info(`Task deleted successfully`);
      return res.status(200).json({ Status: "Task deleted successfully" });
    }
  });
});

app.put("/tasks/:id/status", verifyUser, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE tasks SET Status = ? WHERE TaskID = ? AND UserID = ?";
  db.query(sql, [status, id, req.userId], (err, data) => {
    if (err) {
      console.error("Error updating task status:", err);
      logger.error(`Error in updating task status`);
      return res.status(500).json({ Error: "Failed to update task status" });
    }else{
      logger.info(`Task status updated successfully`);
      return res.status(200).json({ Status: "Task status updated successfully" });
    }
  });
});

app.put("/tasks/:id/favorite", verifyUser, (req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  const favoriteTimestamp = isFavorite === 1 ? new Date() : null;

  const sql = "UPDATE tasks SET IsFavorite = ?, FavoriteTimestamp = ? WHERE TaskID = ? AND UserID = ?";
  db.query(sql, [isFavorite, favoriteTimestamp, id, req.userId], (err, data) => {
    if (err) {
      logger.error(`Error in updating favorite status`);
      return res.status(500).json({ Error: "Failed to update favorite status" });
    }else{
      logger.info(`Favorite status updated successfully`);
      return res.status(200).json({ Status: "Favorite status updated successfully" });
    }
  });
});


app.put("/tasks/:id", verifyUser, (req, res) => {
  const { id } = req.params;
  const { title, desc } = req.body;

  const sql = "UPDATE tasks SET Title = ?, Description = ? WHERE TaskID = ?";
  db.query(sql, [title, desc, id], (err, result) => {
    if (err) {
      // console.log(err);
      logger.error(`Error in updating task`);
      return res.status(500).json({ Status: "Error", Error: err });
    }else{
      logger.info(`Task updated successfully`);
      return res.status(200).json({ Status: "Task updated successfully" });
    }
  });
});

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name, email: req.email });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(8081 || process.env.PORT, () => {
  console.log("connection start");
});
