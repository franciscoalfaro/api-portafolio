import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

// Función para crear el transporter
function crearTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    return nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: emailUser, // Cambia con tu dirección de correo de tu servidor 
            pass: emailPassword // Cambia con tu contraseña
        }
    });
}

// Función para enviar correo de contacto utilizando servidor SMTP
async function enviarCorreoContacto(email, apellido,telefono,mensaje,nombre) {
    const transporter = crearTransporter();
    const emailUser = process.env.EMAIL_USER;


    const emailTemplatePath = path.join('uploads', 'html', 'contacto.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

    const mailOptions = {
        from: emailUser, // Cambia con tu dirección de correo de tu servidor
        cc:emailUser,
        to: email,
        subject: 'Solicitud de contacto',
        html: emailTemplate.replace('{{nombre}}', nombre).replace('{{apellido}}', apellido).replace('{{telefono}}', telefono).replace('{{mensaje}}', mensaje)

    };


    await transporter.sendMail(mailOptions);
}


// Función para enviar correo con enlace de recuperación por token
async function enviarEnlaceRecuperacion(email, urlconvertida) {
    const transporter = crearTransporter();
    const emailUser = process.env.EMAIL_USER;

    const emailTemplatePath = path.join('uploads', 'html', 'enlace.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

    const mailOptions = {
        from: emailUser,
        to: email,
        subject: 'Recuperación de Contraseña — Enlace de restablecimiento',
        html: emailTemplate.replaceAll('${urlconvertida}', urlconvertida)
    };

    await transporter.sendMail(mailOptions);
}

export default{ enviarCorreoContacto, enviarEnlaceRecuperacion };
