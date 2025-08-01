const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required."],
    },
    month: {
      type: Number,
      required: [true, "Month is required."],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, "Year is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);
