const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    sold: Boolean
});

const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell;
