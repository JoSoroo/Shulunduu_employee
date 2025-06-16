const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//DB connect

mongoose
  .connect("mongodb://localhost:27017/shulundu")
  .then(() => console.log("MongoDB holbogdloo"))
  .catch((err) => console.log(err));

//Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const branchRoutes = require("./routes/branch_route");
app.use("/api/branches", branchRoutes);
const employeeRoutes = require("./routes/employee_route");
app.use("/api/employees", employeeRoutes);
const shiftRoutes = require("./routes/shift_route");
app.use("/api/shifts", shiftRoutes);
app.listen(5000, () => console.log("Server started on port 5000"));
