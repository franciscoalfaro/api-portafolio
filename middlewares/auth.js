// importar modulos
import jwt from "jsonwebtoken";

// importar clave secreta
import { secret_key as secret } from "../services/jwt.js";

// Middleware de autenticacion
export const auth = (req, res, next) => {
    // comprobar cabeza de autenticacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene cabecera de autenticacion."
        });
    }

    // limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // decode token
    try {
        let payload = jwt.verify(token, secret);

        // agregar datos de usuario a request
        req.user = payload;

    } catch (error) {
        return res.status(401).send({
            status: "error",
            message: error.name === 'TokenExpiredError' ? "token expirado" : "token invalido"
        });
    }

    // pasar a la ejecucion de la siguiente accion
    next();
};
