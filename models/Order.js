import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    customer: {
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
            required: true
        }
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
},
    { collection: 'orders' });

export const Order = mongoose.model("Order", orderSchema);