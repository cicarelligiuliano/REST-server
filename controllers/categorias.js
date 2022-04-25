const { request } = require("express");
const { response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`,
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioValidado._id,
    };

    const categoria = new Categoria(data);

    //Guardar en DB

    await categoria.save();

    res.status(201).json(categoria);
};

//Obtener categorias - paginado - total - populate

const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate("usuario", "nombre").limit(Number(limite)).skip(Number(desde)),
    ]);

    res.json({
        total,
        categorias,
    });
};

//Obtener categoria - populate
const obtenerCategoria = async (req = request, res = response) => {
    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate("usuario", "nombre");

    res.json(categoria);
};
// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
    const { nombre } = req.body;
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, {
        nombre: nombre.toUpperCase(),
        usuario: req.usuarioValidado.id,
    });

    res.json({
        categoria,
    });
};
// borrarCategoria - cambiar estado a false

const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const usuarioValidado = req.usuarioValidado;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        categoria,
        usuarioValidado,
    });
};
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
};
