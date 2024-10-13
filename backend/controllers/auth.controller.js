const userModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

const signUp = async (req, res) => {
    try {
        const { username,name, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email' });
        }
        const user = await userModel.findOne({ email });
        const usernameExists = await userModel.findOne({ username: username });
        if (usernameExists) {
            return res.status(400).json({ msg: 'Username already exists' });
        }
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(password, salt);
        const avatar = `https://robohash.org/${username}.png`;
        const newUser = new userModel({
            username,
            name,
            email,
            password: passwordHash,
            avatar
        });
        await newUser.save();
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}
const signIn = async (req, res) => {
    try{
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please fill in all fields' });
        }
        const user = await userModel
            .findOne({ username })
            .select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateTokenAndSetCookie(res, user._id);
        res.status(200).json({ message: 'Sign in successful' , user: { id: user._id, username: user.username, name: user.name, email: user.email, avatar: user.avatar } });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports = { signUp, signIn, logout };

