const mongoose = require("mongoose");
const Employee = require("./Employee");
const Branch = require("./Branch");
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
    employees: {
      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
      chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
      waiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
      security: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
      cleaner: {
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
