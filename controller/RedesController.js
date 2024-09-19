import Redes from '../models/redes.js'

export const crearRed = async (req, res) => {
    try {
        let { name, url } = req.body;
        const userId = req.user.id; // Suponiendo que el userId está en el token de autenticación

        // Verificar si el url comienza con "http://" o "https://"
        if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`; // Si no comienza, agregar "https://"
        }

        const nuevaRed = new Redes({
            userId,
            name,
            url
        });

        const redGuardada = await nuevaRed.save();

        return res.status(201).json({
            status: 'success',
            message: 'Red creada correctamente',
            red: redGuardada
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al crear la red',
            error: error.message
        });
    }
};

export const listarRedes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id; // Filtrar por el usuario autenticado

        const redes = await Redes.paginate(
            { userId },
            { page, limit, sort: { fecha: -1 } }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Listado de redes',
            redes: redes.docs,
            totalPages: redes.totalPages,
            totalItems: redes.totalDocs,
            itemsPerPage: redes.limit,
            currentPage: redes.page
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las redes',
            error: error.message
        });
    }
};

export const actualizarRed = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, url } = req.body;
        const userId = req.user.id;
        
        // Verificar si el url comienza con "http://" o "https://"
        if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`; // Si no comienza, agregar "https://"
        }

        const redActualizada = await Redes.findOneAndUpdate(
            { _id: id, userId },
            { name, url },
            { new: true } // Devuelve el documento actualizado
        );

        if (!redActualizada) {
            return res.status(404).json({
                status: 'error',
                message: 'Red no encontrada o no pertenece al usuario'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Red actualizada correctamente',
            red: redActualizada
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la red',
            error: error.message
        });
    }
};


export const eliminarRed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const redEliminada = await Redes.findOneAndDelete({ _id: id, userId });

        if (!redEliminada) {
            return res.status(404).json({
                status: 'error',
                message: 'Red no encontrada o no pertenece al usuario'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Red eliminada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la red',
            error: error.message
        });
    }
};

//listar redes publicas
export const listado = async (req, res) => {
    try {
        // Obtener todos las redes sin paginación y excluyendo el campo userId
        const redes = await Redes.find({}, "-userId").sort({ fecha: -1 });

        return res.status(200).json({
            status: 'success',
            message: 'Listado de redes',
            redes: redes,
            totalItems: redes.length
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las redes',
            error: error.message
        });
    }
};