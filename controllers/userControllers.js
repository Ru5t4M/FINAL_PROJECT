const User = require('../model/User')


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
        
    res.redirect('/products')
}

const registerEjs = (req, res) => {
    res.render('register');
}

const loginEjs = (req, res) => {
    res.render('login');
}

const logout = (req, res) =>{

}

const getUsers = async (req, res) => {
    const users = await User.find({});
    res.render('users', { users });
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
    res.render('editUser', { user });
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

module.exports = { register, login,logout, registerEjs, loginEjs, getUsers, addUser, getEditUser, updateUser, deleteUser};