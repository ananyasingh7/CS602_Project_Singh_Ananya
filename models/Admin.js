import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['SuperAdmin', 'Manager', 'Support'],
        default: 'Manager'
    }
}, 
{ collection: 'admins' });

export const Admin = mongoose.model("Admin", adminSchema);