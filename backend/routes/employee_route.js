const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//ажилтан нэмэх
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { img, name, phone, position, branchId } = req.body;
    console.log(req.body);

    if (!name || !phone || !position || !branchId) {
      return res
        .status(400)
        .json({ message: "Бүх талбарыг бөглөнө үү, зураг шаардлагатай" });
    }
    const imgData = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      : null;

    const newEmployee = new Employee({
      name,
      phone,
      position,
      branchId,
      img: imgData,
    });

    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Ажилчин амжилттай нэмэгдлээ", employee: newEmployee });
    console.log(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
});
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token байхгүй" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token хоосон" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token буруу" });
  }
};

//Ажилтан мэдээлэл авах
router.get("/", verifyToken, async (req, res) => {
  try {
    const { role, branchId } = req.user;
    let filter = {};
    if (role === "manager") {
      filter = { branchId };
    }
    const employee = await Employee.find(filter).populate("branchId").populate("position");
    const formatted = employee.map((emp) => ({
      ...emp.toObject(),
      img: emp.img
        ? emp.img.data
          ? {
              contentType: emp.img.contentType,
              data: emp.img.data.toString("base64"),
            }
          : null
        : null,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ажилчины өгөгдөл авах үед алдаа гарлаа" });
  }
});
//Устгах
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ажилчин устгагдлаа" });
  } catch (err) {
    res.status(500).json({ message: "Устгахад алдаа гарлаа" });
  }
});
//Ажилтан мэдээлэл өөрчлөх
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, phone, position, branchId } = req.body;

    if (!name || !phone || !position || !branchId) {
      return res
        .status(400)
        .json({ message: "Бүх талбарыг бөглөнө үү, зураг шаардлагатай" });
    }
    const imgData = req.file
      ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      : null;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        position,
        branchId,
        img: imgData,
      },
      { new: true }
    );
    res.status(201).json({
      message: "Ажилчин мэдээлэл шинэчлэгдлээ",
      updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
});

// Get total count of employees
router.get("/count", verifyToken, async (req, res) => {
  try {
    const { role, branchId } = req.user;
    let filter = {};
    if (role === "manager") {
      filter = { branchId };
    }
    const count = await Employee.countDocuments(filter);
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Тооллого хийхэд алдаа гарлаа" });
  }
});

module.exports = router;
