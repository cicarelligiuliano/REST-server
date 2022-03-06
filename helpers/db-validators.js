const Role = require("../models/role");
const { res, req } = require("express");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error("No existe el rol espécificado");
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error("El correo ya esta registrado");
  }
};

const existeUsuarioPorId = async (id = "") => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
};
