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
async function enviarCorreoContacto(email, apellido, telefono, mensaje, nombre) {
    const transporter = crearTransporter();
    const emailUser = process.env.EMAIL_USER;

    const emailTemplatePathUsuario = path.join('uploads', 'html', 'contacto.html');
    const emailTemplatePathAdmin = path.join('uploads', 'html', 'contacto-admin.html');

    const emailTemplateUsuario = fs.readFileSync(emailTemplatePathUsuario, 'utf8');
    const emailTemplateAdmin = fs.readFileSync(emailTemplatePathAdmin, 'utf8');

    const htmlReemplazadoUsuario = emailTemplateUsuario
        .replace(/{{nombre}}/g, nombre)
        .replace(/{{apellido}}/g, apellido)
        .replace(/{{telefono}}/g, telefono)
        .replace(/{{email}}/g, email)
        .replace(/{{mensaje}}/g, mensaje);

    const htmlReemplazadoAdmin = emailTemplateAdmin
        .replace(/{{nombre}}/g, nombre)
        .replace(/{{apellido}}/g, apellido)
        .replace(/{{telefono}}/g, telefono)
        .replace(/{{email}}/g, email)
        .replace(/{{mensaje}}/g, mensaje);

    // Correo al usuario
    const mailOptionsUsuario = {
        from: emailUser,
        to: email,
        subject: 'Solicitud de contacto',
        html: htmlReemplazadoUsuario
    };

    // Correo al administrador
    const mailOptionsAdmin = {
        from: emailUser,
        to: emailUser,
        subject: `Nueva solicitud de contacto de ${nombre} ${apellido}`,
        html: htmlReemplazadoAdmin
    };

    await transporter.sendMail(mailOptionsUsuario);
    await transporter.sendMail(mailOptionsAdmin);
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

export default { enviarCorreoContacto, enviarEnlaceRecuperacion };
