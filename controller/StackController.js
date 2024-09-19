// importar modelo
import User from '../models/user.js';
import Stack from '../models/stack.js'


export const crearStack = async (req, res) => {
    const { name, nivel, type_exp, tecnologias } = req.body;

    // Validar que se proporcionen los datos necesarios
    if (!name || !nivel || !type_exp || !tecnologias) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Verificar si ya existe un Stack con el mismo nombre para el usuario
        const stackExistente = await Stack.findOne({ name, userId });

        if (stackExistente) {
            return res.status(400).json({
                status: "error",
                message: "El Stack ya existe. Intente con otro nombre o actualice el existente.",
            });
        }

        // Crear y guardar el nuevo Stack
        const newStack = new Stack({
            userId,
            name,
            nivel,
            type_exp,
            tecnologias
        });

        await newStack.save();

        return res.status(201).json({
            status: "success",
            message: "Stack creado de forma correcta",
            newStack,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Error al crear el Stack",
            error: error.message || "Error desconocido",
        });
    }
};


export const actualizarStack = async (req, res) => {
    const { name, nivel,type_exp } = req.body;
    const idStack = req.params.id;
   

    // Validar que se proporcionen los datos necesarios para la actualización
    if (!name || !nivel || !type_exp) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Verificar si el Stack existe y pertenece al usuario
        const stackExistente = await Stack.findOne({ _id: idStack, userId });

        if (!stackExistente) {
            return res.status(404).json({
                status: 'error',
                message: 'Stack no encontrado o no tiene permisos para modificarlo',
            });
        }

        // Actualizar el Stack con los datos proporcionados
        const stackActualizado = await Stack.findByIdAndUpdate(
            idStack,
            { name, nivel, type_exp },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Stack actualizado correctamente',
            stackActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el Stack',
            error: error.message,
        });
    }
};


export const eliminarStack = async (req, res) => {
    const idStack = req.params.id;

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Buscar el Stack y verificar si el usuario logueado es el creador
        const stackEliminar = await Stack.findOne({ _id: idStack, userId });

        if (!stackEliminar) {
            return res.status(404).json({
                status: 'error',
                message: 'Stack no encontrado o no tiene permisos para eliminarlo',
            });
        }

        // Eliminar el Stack
        await Stack.findByIdAndDelete(idStack);

        return res.status(200).json({
            status: 'success',
            message: 'Stack eliminado correctamente',
            stackEliminado: stackEliminar,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el Stack',
            error: error.message,
        });
    }
};


export const listarStacks = async (req, res) => {
    const userId = req.user.id; // ID del usuario autenticado
    let page = 1
    if (req.params.page) {
        page = req.params.page
    }
    page = parseInt(page)

    let itemPerPage = 6

    try {
        // Configurar opciones de paginación
        const options = {
            page,
            limit:itemPerPage,
            sort: { fecha: -1 } // Opcional: ordenar por fecha en orden descendente
        };

        // Buscar todos los stacks asociados al usuario
        const stacks = await Stack.paginate({ userId }, options);

        return res.status(200).json({
          status: 'success',
          message: 'Stacks encontrados',
          stacks: stacks.docs,         // Lista de los stacks en la página actual
          totalPages: stacks.totalPages,  // Número total de páginas
          totalDocs: stacks.totalDocs,  // Total de documentos
          itemsPerPage: stacks.limit,   // Número de stacks por página
          page: stacks.page      // Página actual
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 'error',
            message: 'Error al listar los stacks',
            error: error.message
        });
    }
};


//listado publico de Stack
export const listado = async (req, res) => {
    try {
        // Obtener todos los skills sin paginación y excluyendo el campo userId
        const stack = await Stack.find({}, "-userId").sort({ fecha: -1 });

        return res.status(200).json({
            status: 'success',
            message: 'Listado de Stack',
            stack: stack,
            totalItems: stack.length
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las Stack',
            error: error.message
        });
    }
};