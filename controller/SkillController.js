import Skill from '../models/skill.js'

export const crearSkill = async (req, res) => {
    const { name, nivel,type_skill } = req.body;

    // Validar que se proporcionen los datos necesarios
    if (!name || !nivel || !type_skill) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Verificar si ya existe un Skill con el mismo nombre para el usuario
        const skillExistente = await Skill.findOne({ name, userId });

        if (skillExistente) {
            return res.status(400).json({
                status: "error",
                message: "El Skill ya existe. Intente con otro nombre o actualice el existente.",
            });
        }

        // Crear y guardar el nuevo Skill
        const newSkill = new Skill({
            userId,
            name,
            nivel,
            type_skill
        });

        await newSkill.save();

        return res.status(201).json({
            status: "success",
            message: "Skill creado de forma correcta",
            newSkill,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Error al crear el Skill",
            error: error.message || "Error desconocido",
        });
    }
};


export const actualizarSkill = async (req, res) => {
    const { name, nivel,type_skill } = req.body;
    const idSkill = req.params.id;
    
    // Validar que se proporcionen los datos necesarios para la actualización
    if (!name || !nivel || !type_skill) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Verificar si el Skill existe y pertenece al usuario
        const skillExistente = await Skill.findOne({ _id: idSkill, userId });

        if (!skillExistente) {
            return res.status(404).json({
                status: 'error',
                message: 'Skill no encontrado o no tiene permisos para modificarlo',
            });
        }

        // Actualizar el Skill con los datos proporcionados
        const skillActualizado = await Skill.findByIdAndUpdate(
            idSkill,
            { name, nivel,type_skill },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Skill actualizado correctamente',
            skillActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el Skill',
            error: error.message,
        });
    }
};


export const eliminarSkill = async (req, res) => {
    const idSkill = req.params.id;

    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Buscar el Skill y verificar si el usuario logueado es el creador
        const skillEliminar = await Skill.findOne({ _id: idSkill, userId });

        if (!skillEliminar) {
            return res.status(404).json({
                status: 'error',
                message: 'Skill no encontrado o no tiene permisos para eliminarlo',
            });
        }

        // Eliminar el Skill
        await Skill.findByIdAndDelete(idSkill);

        return res.status(200).json({
            status: 'success',
            message: 'Skill eliminado correctamente',
            skillEliminado: skillEliminar,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el Skill',
            error: error.message,
        });
    }
};


export const listarSkill = async (req, res) => {
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

        // Buscar todos los skill asociados al usuario
        const skill = await Skill.paginate({ userId }, options);

        return res.status(200).json({
          status: 'success',
          message: 'Skill encontrados',
          skill: skill.docs,         // Lista de los skill en la página actual
          totalPages: skill.totalPages,  // Número total de páginas
          totalDocs: skill.totalDocs,  // Total de documentos
          itemsPerPage: skill.limit,   // Número de skill por página
          page: skill.page      // Página actual
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 'error',
            message: 'Error al listar los skill',
            error: error.message
        });
    }
};


// Listado público de Skill sin paginación
export const listado = async (req, res) => {
    try {
        // Obtener todos los skills sin paginación y excluyendo el campo userId
        const skills = await Skill.find({}, "-userId").sort({ fecha: -1 });

        return res.status(200).json({
            status: 'success',
            message: 'Listado de Skill',
            skills: skills,
            totalItems: skills.length
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las Skill',
            error: error.message
        });
    }
};
