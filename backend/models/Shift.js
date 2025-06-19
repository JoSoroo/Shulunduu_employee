const mongoose = require("mongoose");
const Employee = require("./Employee");
const Branch = require("./Branch");
const Role = require("./Role");

const shiftSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    shiftType: {
      type: String,
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    }],
    employees: {
      type: Map,
      of: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shift", shiftSchema);
