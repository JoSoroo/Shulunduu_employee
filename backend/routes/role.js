const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
// Create a new role
router.post('/', async (req, res) => { 
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү.' });
    }
    const newRole = new Role({ name, description });
    await newRole.save();
    res.status(201).json({ message: 'Албан тушаал амжилттай нэмэгдлээ', role: newRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
});
// Get all roles
router.get('/', async (req, res) => { 
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
});
// Update a role
router.put('/:id', async (req, res) => {    
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү.' });
    }
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: 'Албан тушаал олдсонгүй' });
    }
    res.status(200).json({ message: 'Амжилттай шинэчлэгдлээ', role: updatedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
});
// Delete a role   
router.delete('/:id', async (req, res) => { 
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Албан тушаал олдсонгүй' });
    }
    res.status(200).json({ message: 'Албан тушаалыг амжилттай устгалаа', role: deletedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Серверийн алдаа гарлаа' });
  }
}); 
module.exports = router;