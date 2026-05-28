import 'dotenv'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../models/user.js'
import enviar from "../middlewares/recuperarpass.js"

export const generateResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Válido por 1 hora

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    return resetToken;
};

export const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
        throw new Error('Token inválido o vencido');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return user;
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const resetToken = await generateResetToken(email);

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await enviar.enviarEnlaceRecuperacion(email, resetURL);

        res.status(200).json({ message: 'Email de recuperación enviado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al solicitar la recuperación', error: error.message });
    }
};

export const resetPasswordWithToken = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        await resetPassword(token, newPassword);

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
    }
};



