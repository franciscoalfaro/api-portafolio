import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

const CvSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

CvSchema.plugin(mongoosePaginate);

const Cv = model('Cv', CvSchema, 'cv');
export default Cv;
