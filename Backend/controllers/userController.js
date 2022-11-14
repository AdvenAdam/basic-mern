const Note = require('../models/Note');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// @desc Get all users
// @route Get /users
// @access Private

const getAllusers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users Found' });
    }
    res.json(users);
});

// @desc Create User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Username' });
    }

    //hash password
    const hashedPwd = await bcrypt.hash(password, 10); //salt rounds

    const userObject = { username, password: hashedPwd, roles };

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New User ${username} Created` });
    } else {
        res.status(400).json({ message: `Invalid User Data Received` });
    }
});

// @desc Update User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // confirm
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User Not Found' });
    }

    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    // Allow updates to the original user
    if (duplicate && duplicate?._id != id) {
        return res.status(409).json({ message: `Duplicate User ` });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        // Hash Password
        user.password = await bcrypt.hash(password, 10); //salt rounds
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});
// @desc Delete User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    const notes = await Note.findOne({ user: id }).lean().exec();

    if (notes?.length) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();

    const reply = `Username ${user.username} with ID ${user._id} deleted`;

    res.json(reply);
});

module.exports = { getAllusers, createNewUser, updateUser, deleteUser };
