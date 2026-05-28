import dotenv from 'dotenv';
dotenv.config();

// importar dependencias
import jwt from "jsonwebtoken";

// clave secreta
const secret_key = process.env.SECRET_KEY;

// crear funcion para generar tokens
export const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        organizacion:user.organizacion,
    };
    // devolver jwt token
    return jwt.sign(payload, secret_key, { expiresIn: '30d' });
};

export { secret_key };
