const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../models/usuario");

///////////////////////////////////     LOGIN     ///////////////////////////////////
const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password incorrecto - correo" });
    }
    //Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password incorrecto - estado: false" });
    }
    //Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return;
      res.status(400).json({ msg: "Usuario / Password incorrecto - password" });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocurrio un error",
    });
  }
};

module.exports = {
  login,
};
