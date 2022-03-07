const { response } = require("express");
const { request } = require("express");

const esAdminRole = (req = request, res = response, next) => {
  const usuarioValidado = req.usuarioValidado;
  if (!usuarioValidado) {
    return res.status(500).json({
      msg: "Se quiere validar el rol sin antes validar el token",
    });
  }

  const { rol, nombre } = usuarioValidado;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usuario ${nombre} no tiene permisos de Administrador`,
    });
  }

  next();
};

const tieneRol = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuarioValidado) {
      return res.status(500).json({
        msg: "Se quiere validar el rol sin antes validar el token",
      });
    }

    if (!roles.includes(req.usuarioValidado.rol)) {
      return res.status(401).json({
        msg: `El usuario ${req.usuarioValidado.nombre} no tiene permisos para esta tarea`,
      });
    }

    next();
  };
};

module.exports = {
    esAdminRole,
  tieneRol,
};
