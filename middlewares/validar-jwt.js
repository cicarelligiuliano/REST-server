const { request } = require("express");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ msg: "No hay token en la peticion" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuarioValidado = await Usuario.findById(uid);

    if (!usuarioValidado) {
      return res
        .status(401)
        .json({ msg: "Token no valido - Usuario no existe" });
    }

    if (!usuarioValidado.estado) {
      return res
        .status(401)
        .json({ msg: "Token no valido - Usuario estado false" });
    }

    req.usuarioValidado = usuarioValidado;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
