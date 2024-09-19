import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

const ProyectoSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name_project: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tecnologic: {
        type: String,
        required: true
    },
    type_project: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    repositorio: {
        type: String,
    },
    date_start: {
        type: Date,
    },
    date_end: {
        type: Date,
    },

    images: [{
        filename: String,
    }],
});

ProyectoSchema.plugin(mongoosePaginate);

const Proyecto = model('Proyecto', ProyectoSchema, 'proyectos');
export default Proyecto;
