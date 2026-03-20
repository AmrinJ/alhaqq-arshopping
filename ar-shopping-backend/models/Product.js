const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true, default: 0 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    fabric: { type: String },
    image_url: { type: String },
    ar_model_url: { type: String },
    stock: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
