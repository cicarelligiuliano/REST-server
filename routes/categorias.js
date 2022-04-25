const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares/");
const { existeCategoria } = require("../helpers/db-validators");

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");

const router = Router();

//Obtener todas las categorias
router.get("/", obtenerCategorias);

//Categoria por ID -- validar que ID existe
router.get("/:id", [check("id", "No es un id de Mongo valido").isMongoId(), check("id").custom(existeCategoria), validarCampos], obtenerCategoria);

//Crear categoria - solo con token valido
router.post("/", [validarJWT, check("nombre", "El nombre es obligatorio").not().isEmpty(), validarCampos], crearCategoria);

//Actualizar categoria por ID con token valido
router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id de Mongo valido").isMongoId(),
        check("nombre", "Debe tener un nombre para actualizar").not().isEmpty(),
        check("id").custom(existeCategoria),
        validarCampos,
    ],
    actualizarCategoria
);

//Borrar categoria - Solo admin
router.delete(
    "/:id",
    [validarJWT, esAdminRole, check("id", "No es un id de Mongo valido").isMongoId(), check("id").custom(existeCategoria), validarCampos],
    borrarCategoria
);

module.exports = router;
