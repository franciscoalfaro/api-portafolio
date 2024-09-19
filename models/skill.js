import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

const SkillSchema = Schema({
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
    type_skill: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

SkillSchema.plugin(mongoosePaginate);

const Skill = model('Skill', SkillSchema, 'skill');
export default Skill;