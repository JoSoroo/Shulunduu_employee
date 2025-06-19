const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");
const Branch = require("../models/Branch");
const Role = require("../models/Role");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
console.log("JWT_SECRET in shift_route:", jwtSecret);
//post хүсэлт илгээх
router.post("/", async (req, res) => {
  try {
    const shift = new Shift(req.body);
    await shift.save();
   res.status(201).json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Хадгалах үед алдаа гарлаа" });
  }
});
const verifyToken = (req, res, next) => {
  console.log("==== VERIFY TOKEN MIDDLEWARE ====");
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token байхгүй" });

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded:", decoded); // 👈 check this
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message); // 👈 very important
    return res.status(403).json({ message: "Token буруу" });
  }
};

//Ажилтан мэдээлэл авах
router.get("/", verifyToken, async (req, res) => {
  try {
    const { role, branchId } = req.user;
    console.log("req:user", req.user);
    let filter = {};
    if (role === "manager") {
      filter = { branchId };
    }
    console.log("Shift filter:", filter);
    
    const shift = await Shift.find(filter)
      .populate("branchId")
      .populate("roles")
      .populate({
        path: "employees.$*",
        model: "Employee"
      });

    console.log("Found shifts:", shift);
    console.log("First shift employees:", shift[0]?.employees);
    console.log("First shift roles:", shift[0]?.roles);
    res.status(200).json(shift);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ээлжийн өгөгдөл авах үед алдаа гарлаа" });
  }
});

// ... бусад импорт, код ...

// Зөвхөн тухайн салбарын ээлжүүдийг авах
router.get("/branch/:branchId", async (req, res) => {
  try {
    const { branchId } = req.params;
    if (!branchId) {
      return res.status(400).json({ message: "Салбарын ID шаардлагатай" });
    }

    const shifts = await Shift.find({ branchId })
      .populate("branchId")
      .populate("roles")
      .populate({
        path: "employees.$*",
        model: "Employee"
      });

    res.status(200).json(shifts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Салбарын ээлжийн өгөгдөл авах үед алдаа гарлаа" });
  }
});

// Update shift
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, shiftType, employees, roles } = req.body;

    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      {
        date,
        shiftType,
        employees,
        roles,
      },
      { new: true }
    )
      .populate("branchId")
      .populate("roles")
      .populate({
        path: "employees.$*",
        model: "Employee"
      });

    if (!updatedShift) {
      return res.status(404).json({ message: "Ээлж олдсонгүй" });
    }

    res.status(200).json(updatedShift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ээлж шинэчлэх үед алдаа гарлаа" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedShift = await Shift.findByIdAndDelete(req.params.id);
    if (!deletedShift) {
      return res.status(404).json({ message: "Ээлж олдсонгүй" });
    }
    res
      .status(200)
      .json({ message: "Ээлжийг амжилттай устгалаа", deletedShift });
  } catch (error) {
    console.error("Устгах үед алдаа гарлаа:", error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
});
module.exports = router;
