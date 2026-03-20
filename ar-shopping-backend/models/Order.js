const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image_url: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }
});

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [orderItemSchema],
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: { type: String, required: true, default: 'pending' },
    trackingStatus: { type: String, required: true, default: 'Processing' },
    expectedDelivery: { type: Date }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
