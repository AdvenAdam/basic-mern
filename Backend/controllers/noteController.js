const Note = require('../models/Note');
const User = require('../models/User');

const asyncHandler = require('express-async-handler');

// @desc get all notes
// @route GET /notes
// @access private

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(400).json({ messagge: `No Notes Found` });
    }
    const notesWithUser = await Promise.all(
        notes.map(async (note) => {
            const user = await User.findById(note.user).lean().exec();
            return { ...note, username: user.username };
        })
    );
    res.json(notesWithUser);
});

// @desc Insert Note
// @route POST /notes
// @access private

const createNewNote = asyncHandler(async (res, req) => {
    const { title, user, completed, text } = req.body;
    // confirm data
    //check is user exist
    const userCheck = await User.findById(user).exec();
    if (!userCheck) {
        return res.status(400).json({ message: `User Not Found` });
    }
    if (!title || !user || !text) {
        return res.status(400).json({ message: `All Field Are Required` });
    }
    // check duplicate
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(400).json({ massage: `Notes allready exist` });
    }
    // insert data
    const noteObject = { title, text, user };
    const note = await Note.create(noteObject);
    if (note) {
        return res.status(200).json({ message: `Note with title "${title}" Created` });
    } else {
        return res.status(400).json({ message: `Invalid Data for Note` });
    }
});

// @desc Updated Note
// @route PATCH /notes
// @access private

const updateNote = asyncHandler(async (res, req) => {
    const { id, title, user, completed, text } = req.body;
    // confirm data
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: `Note not found` });
    }
    if (!title || !user || !completed || typeof completed !== Boolean || !text) {
        return res.status(400).json({ message: `All Field Are Required` });
    }
    // check is user exist
    if (!userCheck) {
        return res.status(400).json({ message: `User Not Found` });
    }
    // duplcate data
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate && duplicate?._id != id) {
        return res.status(400).json({ message: `Duplicate Note` });
    }

    note.title = title;
    note.text = text;
    note.completed = completed;
    note.user = user;

    const updateNote = await note.save();
    res.json({ message: `${updateNote.title} updated` });
});

const deleteNote = asyncHandler(async (res, req) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();

    const reply = `Note with title "${result.title}" with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
