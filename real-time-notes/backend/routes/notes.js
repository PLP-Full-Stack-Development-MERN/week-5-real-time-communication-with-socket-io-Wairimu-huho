const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const Joi = require('joi');

//validation
const noteSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required(),
    roomId: Joi.string().required(),
    createdBy: Joi.string().required()
});

//api routes
//get all notes from a room
router.get('/room/:roomId', async (req, res) => {
    try {
        const notes = await Note.find({roomId: req.params.roomId});
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    // Validate request body
    const { error } = noteSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      roomId: req.body.roomId,
      createdBy: req.body.createdBy
    });
    
    try {
      const newNote = await note.save();
      res.status(201).json(newNote);
      
      // Emit socket event for real-time update
      req.app.get('io').to(req.body.roomId).emit('new_note', newNote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update a note
  router.put('/:id', async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) return res.status(404).json({ message: 'Note not found' });
      
      // Validate request body
      const { error } = noteSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      
      // Update fields
      note.title = req.body.title;
      note.content = req.body.content;
      note.updatedAt = Date.now();
      
      const updatedNote = await note.save();
      res.json(updatedNote);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});
  
module.exports = router;