const router = require('express').Router();
const {register, login,logout,  registerEjs, loginEjs, getUsers, addUser, getEditUser, updateUser, deleteUser} = require('../controllers/userControllers');
const { ensureAuthenticated } = require('../middleware/auth');
const { logoutUser } = require("../controllers/userControllers");
const {verifyAdmin} = require("../utils/verifyToken")


router.get("/register", registerEjs)
router.get("/login", loginEjs)
router.get("/", verifyAdmin, getUsers);
router.get("/edituser/:id", ensureAuthenticated, getEditUser);
router.get("/logout", ensureAuthenticated, logoutUser);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logoutUser)
router.post("/", addUser);
router.post("/edituser/:id", ensureAuthenticated, updateUser);
router.delete("/:id", deleteUser); 
router.get("/logout", (req, res)=>{
    res.clearCookie('token');
    res.redirect(req.get('referer'));
})

module.exports = router;