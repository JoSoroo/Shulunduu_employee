const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

router.post('/', async (req, res) => {
  try {
    const { number, department, phone, location } = req.body;

    if (!number || !department || !phone || !location) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү.' });
    }

    const newBranch = new Branch({ number, department, phone, location });
    await newBranch.save();

    res.status(201).json({ message: 'Салбар амжилттай нэмэгдлээ', branch: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
});

router.get('/', async(req, res)=>{
  try{
    const branches = await Branch.find();  // Мэдээллийг бүхэлд нь авах
    res.status(200).json(branches);
  } 
  catch{
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
} );
router.delete('/:id', async(req, res)=>{
  try{
     const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
    if (!deletedBranch) {
      return res.status(404).json({ message: 'Салбар олдсонгүй' });
    }
    res.status(200).json({ message: 'Салбарыг амжилттай устгалаа', deletedBranch });
  }
  catch{
    console.error('Устгах үед алдаа гарлаа:', error);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});
router.put('/:id', async(req, res)=>{
  try{
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // шинэчилсний дараах утгыг буцаана, шалгалт хийнэ
    );
    if (!updatedBranch) {
      return res.status(404).json({ message: 'Салбар олдсонгүй' });
    }
    res.status(200).json({ message: 'Амжилттай шинэчлэгдлээ', updatedBranch });
  }
  catch{
    console.error('Шинэчлэх үед алдаа:', error);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
})

module.exports = router;
