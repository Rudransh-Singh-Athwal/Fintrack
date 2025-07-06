const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: "Miscellaneous",
    }
}, { timestamps: true, }
);

module.exports = mongoose.model('Transaction', transactionSchema);