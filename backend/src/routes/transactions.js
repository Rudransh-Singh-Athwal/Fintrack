const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const { transactionValidator } = require('../validators/transaction');

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        next({
            status: 500,
            message: "Failed to fetch transactions",
            error: err.message
        });
    }
})

router.post('/', async (req, res, next) => {
    const { error } = transactionValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        })
    }

    try {
        const transaction = new Transaction(req.body);
        const saved = await transaction.save();
        res.status(201).json(saved);
    } catch (err) {
        next({
            status: 500,
            message: "Failed to create transaction",
            error: err.message
        });
    }
});

router.put('/:id', async (req, res, next) => {
    const { error } = transactionValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    try {
        const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({
                status: 404,
                message: "Transaction not found"
            });
        }
        res.status(200).json({
            status: 200,
            message: `Transaction of ${updated.amount} for ${updated.description} updated successfully`,
            transaction: updated
        })
    } catch (err) {
        next({
            status: 500,
            message: "Failed to update transaction",
            error: err.message
        });
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                status: 404,
                message: "Transaction not found"
            });
        }
        res.status(200).json({
            status: 200,
            message: `Transaction of ${transaction.amount} for ${transaction.description} deleted successfully`
        })
    } catch (err) {
        next({
            status: 500,
            message: "Failed to delete transaction",
            error: err.message
        })
    }
})

module.exports = router;