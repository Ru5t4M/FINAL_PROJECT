const User = require('../model/User')
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
    const userData = req.body
    const user = new User(userData)
    const savedUser = await user.save()

    if (!savedUser) return res.status(400).json({ message: 'Registration failed' })

    res.status(200).redirect("/users/login")
}

const login  = async (req, res) => {
    const userData = req.body
    const user = await User.findOne({ username: userData.username })

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
        
    if (user.password!== userData.password) return res.status(401).json({ message: 'Invalid credentials' })
    const data = {
        username: user.username,
        isAdmin: user.isAdmin
    }
    const options = {
        expiresIn: '1h' 
    };
    const token = jwt.sign(data, "salam123", options);
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/')
}

const registerEjs = (req, res) => {
    res.render('register');
}

const loginEjs = (req, res) => {
    res.render('login');
}

const logoutUser = (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/'); 
};


const getUsers = async (req, res) => {
    const users = await User.find({});
    const token = req.cookies.token;
    console.log(token);
    res.render('users', { users, token });
};

const addUser = async (req, res) => {
    const userData = req.body;
    const user = new User(userData);
    await user.save();
    res.status(201).json(user);
};

const getEditUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = req.cookies.token;
    const hasToken = !!token;
    res.render('editUser', { user, hasToken });
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).redirect('/users');
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
};

module.exports = { register, login, logoutUser, registerEjs, loginEjs, getUsers, addUser, getEditUser, updateUser, deleteUser};