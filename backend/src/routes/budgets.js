const express = require("express");
const router = express.Router();
const Budget = require("../models/budgets");
const { budgetValidator } = require("../validators/budget");

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ year: -1, month: -1 });
    res.status(200).json(budgets);
  } catch (err) {
    next({
      status: 500,
      message: "Failed to fetch budgets",
      error: err.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { error } = budgetValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { category, month, year } = req.body;

  try {
    const existingBudget = await Budget.findOne({ category, month, year });
    if (existingBudget) {
      return res.status(409).json({
        message: "A budget for this category, month, and year already exists.",
      });
    }

    const budget = new Budget(req.body);
    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    next({
      status: 500,
      message: "Failed to create budget",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  const { error } = budgetValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: "Budget not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: `Budget for ${updated.month}, ${updated.year} updated to ${updated.amount} successfully`,
      budget: updated,
    });
  } catch (err) {
    next({
      status: 500,
      message: "Failed to update budget",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({
        status: 404,
        message: "Budget not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: `Budget for 0${budget.month}-${budget.year} worth INR ${budget.amount} deleted successfully`,
    });
  } catch (err) {
    next({
      status: 500,
      message: "Failed to delete budget",
      error: err.message,
    });
  }
});

module.exports = router;
