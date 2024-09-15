const express = require("express");
const app = express();
const cors = require("cors");
const { Upload } = require("./controllers/upload");
const { fetchvideo } = require("./controllers/getvideo");
const { quality } = require("./controllers/quality");
const { fetchallvideos } = require("./controllers/fetchvideos.js");
const { login } = require("./controllers/login");
const { notlike } = require("./controllers/undolike");
const { likes } = require("./controllers/likes");
const { dislikes } = require("./controllers/dislikes");
const { notdislikes } = require("./controllers/undodislike");
const { subscribe } = require("./controllers/subscribe");
const { unsubscribe } = require("./controllers/unsubscribe");
const { signup } = require("./controllers/signup");
const { createchannel } = require("./controllers/createchannel");
const multer = require("multer");
const { storage } = require("./config/multer");
const mongoose = require("mongoose");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const { relatedcontent } = require("./controllers/relatedcontent.js");
const { addcomment } = require("./controllers/addcomment.js");
const { getcomments } = require("./controllers/getcomments.js");
const { save } = require("./controllers/save.js");
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});
app.use((req, res, next) => {
  req.io = io; // Attach io to the request object
  next();
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
const upload = multer({ storage: storage });
mongoose
  .connect("mongodb://localhost:27017/youtube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  (req, res) => Upload(req, res, io)
);
app.post("/videos/:id", fetchvideo);
app.post("/quality/:id", quality);
app.get("/allvideos", fetchallvideos);
app.post("/login", login);
app.post("/like/:id", likes);
app.post("/undolike/:id", notlike);
app.post("/dislike/:id", dislikes);
app.post("/undodislike/:id", notdislikes);
app.post("/subscribe", subscribe);
app.post("/unsubscribe", unsubscribe);
app.post("/signup/:id", signup);
app.post("/addcomments/:id", addcomment);
app.get("/getcomments/:id", getcomments);
app.post("/relatedcontent/:id", relatedcontent);
app.post("/save/:id", save);
app.post("/createchannel", upload.single("avatar"), createchannel);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = { io };
