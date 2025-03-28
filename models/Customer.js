import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
    password: {
        type: String,
        required: true
    },
    orders: [{
        _id: {
            type: String,
            required: true
        },
        products: [{
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        total_price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
},
    { collection: 'customers' });

export const Customer = mongoose.model("Customer", customerSchema);