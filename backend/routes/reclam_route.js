const express = require("express");
const router = express.Router();
const Reclam = require("../models/Reclam");
const multer = require("multer");

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const imageData = req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null;
        const newReclam = new Reclam({ image: imageData, title });
        await newReclam.save();
        res.status(201).json(newReclam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const reclam = await Reclam.find();
        const formatted = reclam.map((reclam) => ({
            ...reclam.toObject(),
            image: reclam.image
            ? reclam.image.data
            ? {
                contentType: reclam.image.contentType,
                data: reclam.image.data.toString("base64"),
            }
            : null
            : null,
        }));
        res.status(200).json(formatted
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedReclam = await Reclam.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Реклам устгагдлаа" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const updateData = { title };
        
        // If a new image is uploaded, include it in the update
        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        
        const updatedReclam = await Reclam.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );
        res.status(200).json(updatedReclam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;