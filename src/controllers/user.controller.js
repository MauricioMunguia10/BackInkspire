import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};
export const createUser = async (req, res) => {
  try {
    const { name, user, email, password, second_email, type_user, active } =
      req.body;

    if (
      !name ||
      !user ||
      !email ||
      !password ||
      !second_email ||
      !type_user ||
      !active
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      user,
      email,
      password: hashedPassword,
      second_email,
      type_user,
      active,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.keyPattern });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userInfo = user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).json({ message: "Inicio de sesión exitoso", userInfo });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

export const recoverUser = async (req, res) => {
  try {
    const { email, second_email } = req.body;

    if (!email || !second_email) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ email, second_email });

    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    res.status(200).json({
      message: "Usuario encontrado. Puedes cambiar tu contraseña ahora.",
      value: user.id.toString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};
export const changePwdUser = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(201)
      .json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
