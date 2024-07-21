const router = require('express').Router();
const {register, login,logout,  registerEjs, loginEjs, getUsers, addUser, getEditUser, updateUser, deleteUser} = require('../controllers/userControllers');

router.get("/register", registerEjs)
router.get("/login", loginEjs)
router.get("/", getUsers);
router.get("/edituser/:id", getEditUser);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.post("/", addUser);
router.post("/edituser/:id", updateUser);
router.delete("/:id", deleteUser); 

module.exports = router;