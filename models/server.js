const express = require("express");
const cors = require("cors");
const router = require("../routes/user");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = "/api/usuarios";
        this.authPath = "/api/auth";
        this.categoriasPath = "/api/categorias";
        this.productosPath = "/api/productos";
        this.buscarPath = "/api/buscar";

        //conectar DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.usuariosPath, require("../routes/user"));

        this.app.use(this.authPath, require("../routes/auth"));

        this.app.use(this.categoriasPath, require("../routes/categorias"));
        this.app.use(this.productosPath, require("../routes/productos"));
        this.app.use(this.buscarPath, require("../routes/buscar"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Montado en puerto ${this.port}`);
        });
    }
}

module.exports = Server;
