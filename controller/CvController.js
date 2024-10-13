import Cv from '../models/cv.js';
import fs from 'fs';
import path from 'path';


//extensiones permitidas
const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'xlsx', 'txt'];
//extensiones no permitidas
const disallowedExtensions = ['exe', 'bat', 'sh'];

//listar cv
export const obtenercv = async (req, res) => {
    try {
        // Buscar todos los CVs en la base de datos
        const cvs = await Cv.find(); // Populamos el nombre del usuario

        // Verificar si se encontraron CVs
        if (!cvs || cvs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No se encontraron CVs"
            });
        }

        // Enviar respuesta con la lista de CVs
        return res.status(200).send({
            status: "success",
            message: "CVs encontrados",
            cv: cvs
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener los CVs",
            error
        });
    }
};

//subir cv
export const subircv = async (req, res) => {

    if (!req.file) {
        return res.status(400).send({
            status: "error",
            message: "CV no seleccionado"
        });
    }

    // Validar el tipo de archivo
    const validMimeType = "application/pdf";
    if (req.file.mimetype !== validMimeType) {
        // Borrar el archivo si no es PDF
        const filePath = req.file.path;
        fs.unlinkSync(filePath);

        return res.status(400).json({
            status: "error",
            message: "Solo se permiten archivos PDF"
        });
    }

    const rutasubida = path.join('uploads', 'cvs');

    try {
        // Guardar información del CV en la base de datos
        const newCv = new Cv({
            userId: req.user.id, // Asegúrate de que el middleware de autenticación añada el ID del usuario
            name: req.file.originalname,
            path: path.join(rutasubida, req.file.filename).replace(/\\/g, '/'),  // Guardar la ruta completa del archivo
            filepath: req.file.filename,  // Guardar la ruta completa del archivo
            mimetype: req.file.mimetype
        });

        const savedCv = await newCv.save();

        return res.status(200).send({
            status: "success",
            message: "CV subido exitosamente",
            cv: savedCv
        });

    } catch (error) {
        // Eliminar el archivo si ocurre un error en el guardado
        const filePath = req.file.path;
        fs.unlinkSync(filePath);

        return res.status(500).send({
            status: "error",
            message: "Error al guardar el CV en la base de datos",
            error
        });
    }
};

//mostrar cv
export const mostrarCV = (req, res) => {

    //obtener parametro de la url
    const file = req.params.file

    //montar el path real de la image
    const filePath = "./uploads/cvs/" + file


    try {
        //comprobar si archivo existe
        fs.stat(filePath, (error, exist) => {
            if (!exist) {
                return res.status(404).send({
                    status: "error",
                    message: "el cv no existe"
                })
            }
            //devolver archivo en el caso de existir  
            return res.sendFile(path.resolve(filePath));
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "error al obtener la informacion en servidor"
        })
    }
}

//descargar cv
export const downloadFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        // Buscar el archivo en la base de datos
        const file = await Cv.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Construir la ruta completa del archivo
        const filePath = path.resolve(file.path);

        // Verificar si el archivo existe en el sistema de archivos
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado en el sistema de archivos' });
        }

        // Obtener el tamaño del archivo si no está almacenado en la base de datos
        const fileStat = fs.statSync(filePath);
        const fileSize = fileStat.size;

        // Configurar el tipo de contenido basado en la extensión del archivo o el mimetype
        const mimeType = file.mimetype || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);

        // Configurar cabeceras para asegurar la descarga correcta
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Access-Control-Expose-Headers', 'File-Name');
        res.setHeader('Content-Length', fileSize);
        res.setHeader('File-Name', file.name);



        // Leer y enviar el archivo al cliente como un flujo de datos
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Manejar posibles errores durante la lectura del archivo
        fileStream.on('error', (err) => {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ error: 'Error al descargar el archivo' });
        });

    } catch (error) {
        console.error('Error en la descarga:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar un archivo
export const deleteFile = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.id;

    try {
        const file = await Cv.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Verificar si el campo uploadedBy existe
        if (!file.userId) {
            return res.status(500).json({ error: 'El archivo no tiene información sobre el usuario que lo subió' });
        }

        // Verificar si el usuario que intenta eliminar el archivo es el que lo subió o es admin
        if (file.userId.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este archivo' });
        }

        // Eliminar el archivo físicamente si es necesario
        const filePath = file.path;  // Asegúrate de que file.path sea la ruta correcta al archivo
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el archivo físico' });
            }
            // Eliminar el archivo de la base de datos después de que se haya eliminado físicamente
            Cv.findByIdAndDelete(fileId)
                .then(() => {
                    return res.status(200).json({ status: "success", message: 'Archivo eliminado correctamente' });
                })
                .catch(err => {
                    return res.status(500).json({ error: 'Error al eliminar el archivo de la base de datos', details: err.message });
                });
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};