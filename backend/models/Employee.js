const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      data: Buffer, // зурагны binary өгөгдөл
      contentType: String, // MIME төрөл (жишээ нь image/png)
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // assuming you have a Branch model
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);
module.exports = mongoose.model("Employee", employeeSchema);
