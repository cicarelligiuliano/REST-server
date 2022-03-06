const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const { emailExiste } = require("../helpers/db-validators");

////////////////////////////////////////             GET              ////////////////

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit = 5 } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // const usuarios = await Usuario.find(query)
  //   .limit(Number(limite))
  //   .skip(Number(desde));

  // const total = await Usuario.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

////////////////////////////////////////             POST              ////////////////

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en base de datos
  await usuario.save();

  res.json(usuario);
};

////////////////////////////////////////             PUT              ////////////////

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario,
  });
};
////////////////////////////////////////             DELETE              ////////////////

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    usuario,
  });
};

////////////////////////////////////////             PATCH              ////////////////

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API",
  });
};

module.exports = {
  usuariosGet,
  usuariosDelete,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
};
