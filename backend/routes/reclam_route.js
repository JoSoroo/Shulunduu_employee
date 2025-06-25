const express = require("express");
const router = express.Router();
const Reclam = require("../models/Reclam");
const multer = require("multer");

// Update multer configuration to accept both image and video files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
  },
});

router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { title } = req.body;
    const imageData = req.files['image'] ? {
      data: req.files['image'][0].buffer,
      contentType: req.files['image'][0].mimetype,
    } : null;
    const videoData = req.files['video'] ? {
      data: req.files['video'][0].buffer,
      contentType: req.files['video'][0].mimetype,
    } : null;
    const newReclam = new Reclam({ image: imageData, video: videoData, title });
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
      image: reclam.image && reclam.image.data
        ? {
            contentType: reclam.image.contentType,
            data: reclam.image.data.toString("base64"),
          }
        : null,
      video: reclam.video && reclam.video.data
        ? {
            contentType: reclam.video.contentType,
            data: reclam.video.data.toString("base64"),
          }
        : null,
    }));
    res.status(200).json(formatted);
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

router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };
    if (req.files['image']) {
      updateData.image = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype,
      };
    }
    if (req.files['video']) {
      updateData.video = {
        data: req.files['video'][0].buffer,
        contentType: req.files['video'][0].mimetype,
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