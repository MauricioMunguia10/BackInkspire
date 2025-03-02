import User from "../models/User.js";

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
    const { name, user, email, password, second_email } = req.body;

    if (!name || !user || !email || !password || !second_email) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const newUser = new User({ name, user, email, password, second_email });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creando usuario" });
  }
};
