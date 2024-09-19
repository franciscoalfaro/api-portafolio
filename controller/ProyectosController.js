// Importar el modelo Proyecto (ajusta la ruta según tu estructura de proyecto)
import Proyecto from '../models/proyecto.js';
import fs from 'fs';

import is from 'fs/promises';
import path from 'path';

// Controlador para crear proyectos
export const crearProyecto = async (req, res) => {
    const params = req.body;

    // Verificar si faltan campos requeridos
    if (!params.name_project || !params.description || !params.tecnologic || !params.type_project) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userId = req.user.id; // Extraer userId del token

        // Crear nuevo proyecto y asignar campos
        const newProyecto = new Proyecto({
            name_project: params.name_project,
            description: params.description,
            tecnologic: params.tecnologic,
            url: params.url,
            repositorio: params.repositorio,
            type_project: params.type_project,
            date_start: params.date_start ? new Date(params.date_start) : Date.now(), // Manejar la fecha
            date_end: params.date_end ? new Date(params.date_end) : null,
            userId: userId, // Asignar el userId del token autenticado
        });

        // Guardar el proyecto en la base de datos
        await newProyecto.save();

        return res.status(200).json({
            status: "success",
            message: "Proyecto guardado de forma correcta",
            newProyecto,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Error al crear el Proyecto",
            error: error.message || "Error desconocido",
        });
    }
};



// Controlador para eliminar proyectos
export const eliminarProyecto = async (req, res) => {
    const idProyecto = req.params.id;

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Buscar el Stack y verificar si el usuario logueado es el creador
        const proyectoEliminar = await Proyecto.findOne({ _id: idProyecto, userId });

        if (!proyectoEliminar) {
            return res.status(404).json({
                status: 'error',
                message: 'Proyecto no encontrado o no tiene permisos para eliminarlo',
            });
        }

        // Eliminar el Stack
        await Proyecto.findByIdAndDelete(idProyecto);

        return res.status(200).json({
            status: 'success',
            message: 'Stack eliminado correctamente',
            proyectoEliminado: proyectoEliminar,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el Stack',
            error: error.message,
        });
    }
};


// Controlador para eliminar una imagen
export const eliminarImagen = async (req, res) => {
    try {
        const projectId = req.body.projectId; // Obtener el ID del proyecto desde el cuerpo de la solicitud
        const userId = req.user.id; // Obtener el ID del usuario autenticado
        const imagenId = req.params.id; // Extraer el ID de la imagen desde los parámetros de la solicitud

        // Buscar el proyecto que contiene la imagen
        const proyecto = await Proyecto.findOne({ _id: projectId, userId: userId });

        if (!proyecto) {
            return res.status(404).json({
                status: 'error',
                message: 'Proyecto no encontrado o no pertenece al usuario'
            });
        }

        // Buscar la imagen a eliminar dentro del proyecto
        const imagen = proyecto.images.find(img => img._id.toString() === imagenId);
        if (!imagen) {
            return res.status(404).json({
                status: 'error',
                message: 'Imagen no encontrada en el proyecto'
            });
        }

        // Construir la ruta absoluta del archivo a eliminar
        const filePath = path.resolve('./uploads/proyectos/', imagen.filename);

        try {
            // Verificar si el archivo existe antes de intentar eliminarlo
            await is.access(filePath); // Verifica si el archivo existe

            // Eliminar el archivo del sistema de archivos
            await is.unlink(filePath);
        } catch (err) {
            console.error('Error eliminando el archivo físico:', err);
            return res.status(500).json({
                status: 'error',
                message: 'No se pudo eliminar el archivo físico de la imagen',
                error: err.message
            });
        }

        // Eliminar la imagen del array de imágenes en el proyecto
        await Proyecto.updateOne(
            { _id: projectId, userId: userId },
            { $pull: { images: { _id: imagenId } } }
        );

        // Filtrar las imágenes restantes después de la eliminación
        const imagenesRestantes = proyecto.images.filter(img => img._id.toString() !== imagenId);

        return res.status(200).json({
            status: 'success',
            message: 'Imagen eliminada correctamente',
            imagenes: imagenesRestantes // Devuelve las imágenes restantes
        });

    } catch (error) {
        console.error('Error en la eliminación de la imagen:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la imagen',
            error: error.message
        });
    }
}

export const actualizarProyecto = async (req, res) => {
    try {
        const userId = req.user.id;
        const idProyecto = req.params.id;  // Asumiendo que el id se encuentra en los parámetros
        const proyectoActualizado = req.body;

        // Verificar si el proyecto existe
        const proyectoExistente = await Proyecto.findById(idProyecto);

        if (!proyectoExistente) {
            return res.status(404).json({
                status: 'error',
                message: 'Proyecto no fue encontrado'
            });
        }

        // Verificar si el usuario logueado es el creador del proyecto
        if (proyectoExistente.userId.toString() !== userId) {
            return res.status(403).json({
                status: 'error',
                message: 'No tiene permisos para modificar este Proyecto'
            });
        }

        // Actualizar el proyecto con los datos proporcionados
        const proyectoActualizadoResult = await Proyecto.findByIdAndUpdate(idProyecto, proyectoActualizado, { new: true });

        return res.status(200).json({
            status: 'success',
            message: 'Proyecto actualizado correctamente',
            proyectoActualizado: proyectoActualizadoResult
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el Proyecto',
            error: error.message
        });
    }
};

// Controlador para listar proyectos del usuario// Controlador para listar proyectos del usuario
export const listarProyecto = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id; // Filtrar por el usuario autenticado

        const projects = await Proyecto.paginate(
            { userId },
            { page, limit, sort: { fecha: -1 } }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Listado de proyectos',
            projects: projects.docs,
            totalPages: projects.totalPages,
            totalItems: projects.totalDocs,
            itemsPerPage: projects.limit,
            currentPage: projects.page
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar los proyectos',
            error: error.message
        });
    }
};


// Controlador para subir imágenes a los artículos
export const upload = async (req, res) => {
    // Sacar el ID del producto
    const proyectId = req.params.id;

    // Recoger los archivos de imagen
    const files = req.files;

    // Verificar si se proporcionaron archivos de imagen
    if (!files || files.length === 0) {
        return res.status(404).send({
            status: "error",
            message: "No se seleccionaron imágenes",
        });
    }

    try {
        const validExtensions = ["png", "jpg", "jpeg", "gif"];
        const invalidFiles = [];
        const validFiles = [];

        // Verificar las extensiones de los archivos
        files.forEach(file => {
            const imageSplit = file.originalname.split(".");
            const extension = imageSplit[imageSplit.length - 1].toLowerCase();

            if (!validExtensions.includes(extension)) {
                // Si la extensión no es válida, agregar el archivo a la lista de archivos inválidos
                invalidFiles.push(file.originalname);
            } else {
                // Si la extensión es válida, agregar el archivo a la lista de archivos válidos
                validFiles.push(file);
            }
        });

        // Si hay archivos con extensiones inválidas, devolver un error
        if (invalidFiles.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "Las siguientes imágenes tienen extensiones no válidas: " + invalidFiles.join(", "),
            });
        }

        // Crear un array de objetos con los datos de cada archivo
        const imagesData = validFiles.map(file => ({
            filename: file.filename,
        }));

        // Actualizar el producto con las imágenes subidas
        const project = await Proyecto.findOneAndUpdate(
            { "userId": req.user.id, "_id": proyectId },
            { $push: { images: imagesData } },
            { new: true }
        );

        if (!project) {
            // Si el producto no se encuentra, devolver un error
            return res.status(404).json({ status: "error", message: "project no encontrado" });
        }

        // Entregar una respuesta con éxito y la información del project actualizada
        return res.status(200).json({
            status: "success",
            message: "Imágenes subidas correctamente",
            project: project,
        });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};


// Controlador para devolver archivos multimedia
export const media = (req, res) => {
    // Obtener parámetro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = path.join('./uploads/proyectos/', file);

    try {
        // Comprobar si el archivo existe
        fs.stat(filePath, (error, stats) => {
            if (error || !stats.isFile()) {
                return res.status(404).json({
                    status: "error",
                    message: "La imagen no existe"
                });
            }

            // Devolver el archivo en caso de existir
            return res.sendFile(path.resolve(filePath));
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la información en el servidor"
        });
    }
};


// Controlador para obtener un proyecto por ID
export const obtenerProyecto = async (req, res) => {
    try {
        const idProyecto = req.params.id;

        // Buscar el proyecto por ID y poblar el campo 'userId' con el nombre del usuario
        const proyecto = await Proyecto.findById(idProyecto)

        // Verificar si el proyecto fue encontrado
        if (!proyecto) {
            return res.status(404).json({
                status: "error",
                message: "Proyecto no encontrado"
            });
        }

        // Devolver el proyecto en la respuesta
        return res.status(200).json({
            status: "success",
            proyecto
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al buscar el proyecto",
            error: error.message
        });
    }
};


//listado publico de proyectos
export const listado = async (req, res) => {
    try {
        // Obtener todos los skills sin paginación y excluyendo el campo userId
        const proyecto = await Proyecto.find({}, "-userId").sort({ fecha: -1 });

        return res.status(200).json({
            status: 'success',
            message: 'Listado de proyectos',
            proyecto: proyecto,
            totalItems: proyecto.length
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las proyectos',
            error: error.message
        });
    }
};