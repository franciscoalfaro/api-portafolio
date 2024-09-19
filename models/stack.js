import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

const StackSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true
    },
    tecnologias:{
        type: String,
    },
    type_exp: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

StackSchema.plugin(mongoosePaginate);

const Stack = model('Stack', StackSchema, 'stacks');
export default Stack;