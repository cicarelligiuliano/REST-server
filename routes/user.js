const { Router } = require("express");
const { check } = require("express-validator");
const Role = require("../models/role");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/users");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRol,
} = require("../middlewares");

const router = Router();

////////////////////////////////////////             GET              ////////////////
router.get("/", usuariosGet);

////////////////////////////////////////             PUT              ////////////////
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],

  usuariosPut
);

////////////////////////////////////////             POST              ////////////////
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("password", "El password tiene que tener mas de 6 letras").isLength({
      min: 6,
    }),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);
////////////////////////////////////////             DELETE              ////////////////
router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

////////////////////////////////////////             PATCH              ////////////////
router.patch("/", usuariosPatch);

module.exports = router;
