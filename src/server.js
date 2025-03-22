import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import multer from "multer";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: "dqxmwhvhf",
  api_key: "699166341661832",
  api_secret: "b1RP_zaKMuGYT6Zk3YUHdbI2qGo",
});

app.use("/api/users", userRoutes);

const PostSchema = new mongoose.Schema({ title: String, categoria: String , contenido: String, imgUrl:String, creator : String, usersave: [String] });
const Post = mongoose.model("post", PostSchema);

const UserSchema = new mongoose.Schema({name: String, user:String, email:String, password: String, second_email: String, type_user: String, active:Boolean, createdAt: Date });
const User = mongoose.model("user", UserSchema);

// Rutas API
app.get("/", (req, res) => res.send("API funcionando"));
app.get("/postsUser", async (req, res) => {
  const user = req.query.user;
  const posts = await Post.find({ creator: user }); // filtro por el campo user si existe
  res.json(posts);
});

app.get("/user", async (req, res) => {
    const user = req.query.user;
    const posts = await User.find({ user: user }); // filtro por el campo user si existe
    res.json(posts);
  });

app.get("/postsSaved", async (req, res) => {
  const user = req.query.user;
  console.log(user)
  const posts = await Post.find({ usersave: user }); // filtro por el campo user si existe
  res.json(posts);
});
app.put("/postsSaved/add", async (req, res) => {
  const { postId, user } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { usersave: user } }, // Agrega sin duplicar
      { new: true } // Devuelve el documento actualizado
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating post" });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find(); // filtro por el campo user si existe
  res.json(posts);
});

app.post("/posts", upload.single("image"), async (req, res) => {
    try {
      console.log("📩 Datos recibidos:", req.body);
      console.log("📸 Archivo recibido:", req.file);
      const result = await cloudinary.uploader.upload(req.file.path);

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error al eliminar el archivo local:", err);
        } else {
          console.log("Archivo local eliminado exitosamente");
        }
      });

      if (!req.file) {
        return res.status(400).json({ message: "No se recibió ninguna imagen" });
      }
  
      const newPost = new Post({
        title: req.body.title,
        categoria: req.body.categoria,
        contenido: req.body.contenido,
        imgUrl: result.secure_url, // URL de la imagen
        creator: req.body.creator
      });
  
      const savedPost = await newPost.save();
  
      console.log("✅ Post guardado:", savedPost);
      res.json(savedPost);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      res.status(500).json({ message: "Error al guardar el post", error });
    }
  });
  
  app.use("/uploads", express.static("uploads"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
