const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

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
const roleRoutes = require("./routes/role");
app.use("/api/roles", roleRoutes);

// Reclam routes with multer middleware for POST only
const reclamRoutes = require("./routes/reclam_route");
app.use("/api/reclams", reclamRoutes);

app.listen(5000, () => console.log("Server started on port 5000"));
