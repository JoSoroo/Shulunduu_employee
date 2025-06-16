const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Manager = require("../models/Manager");

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

//Admin Login

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  // ⬅️ 1. Админыг шалгах
  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: "admin", username }, jwtSecret, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Admin нэвтэрлээ",
      token,
      user: {
        username,
        role: "admin",
      },
    });
  }

  // ⬅️ 2. Менежерийг шалгах
  try {
    const manager = await Manager.findOne({ username });
    if (!manager) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }

    const match = bcrypt.compareSync(password, manager.password);
    if (!match) {
      return res.status(401).json({ message: "Нууц үг буруу байна" });
    }

    const token = jwt.sign(
      {
        role: "manager",
        username: manager.username,
        id: manager._id,
        branchId: manager.branchId,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Manager нэвтэрлээ",
      token,
      user: {
        id: manager._id,
        username: manager.username,
        role: "manager",
        branchId: manager.branchId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
});

router.get("/", async (req, res) => {
  try {
    const managers = await Manager.find().populate("branchId");
    res.status(200).json(managers);
  } catch (err) {
    res.status(500).json({ message: "Менежерүүдийн авахад алдаа гарлаа" });
  }
});
// Add manger(only admin)
router.post("/", async (req, res) => {
  const { username, password, token } = req.body;
  try {
    const { username, password, name, phone, branchId } = req.body;
    // Нууц үг шифрлэх
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newManager = new Manager({
      username,
      password: hashedPassword,
      name,
      phone,
      branchId,
      role: "manager",
    });
    await newManager.save();
    res.status(201).json({ message: "Amjilttai" });
  } catch (err) {
    res.status(500).json({ message: "Бүртгэхэд алдаа гарлаа" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { username, password, name, phone, branchId } = req.body;
    const updated = await Manager.findByIdAndUpdate(
      req.params.id,
      { username, password, name, phone, branchId },
      { new: true }
    );
    res.status(200).json({ message: "Амжилттай засагдлаа", updated });
  } catch (err) {
    res.status(500).json({ message: "Засахад алдаа гарлаа" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Менежер устгагдлаа" });
  } catch (err) {
    res.status(500).json({ message: "Устгахад алдаа гарлаа" });
  }
});
//Manager login
// router.post("/manager/login", async (req, res) => {
//   const { username, password } = req.body;
//   const manager = await Manager.findOne({ username });
//   if (!manager) return res.statu(401).json({ message: "invaild credentials" });
//   const isMatch = await bcrypt.compare(password, manager.password);
//   if (!isMatch) return res.status(401).json({ message: "Invaild credentials" });

//   const token = jwt.sign({ role: "manager", username }, jwtSecret);
//   res.json({ token });
// });

module.exports = router;
