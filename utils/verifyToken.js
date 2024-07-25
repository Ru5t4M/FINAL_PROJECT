const jwt = require("jsonwebtoken")

const verifyAdmin = async (req, res, next) =>{
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, "salam123", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token verification failed' });
        }

        // Check if isAdmin is true in the request body
        if (decoded.isAdmin === true) {
            req.user = decoded;
            next()
        }
        else{
            return res.status(401).json({ message: 'You are not authorized' });
        }
    });
}

const adminAccess = async (req) =>{
    const token = req.cookies.token
    return new Promise((resolve, reject) => {
        if (!token) {
            return resolve(false);
        }
    jwt.verify(token, "salam123", (err, decoded) => {
        if (err) {
            return resolve(false)
        }

        // Check if isAdmin is true in the request body
        if (decoded.isAdmin) {
            resolve(true)
        }
        else{
            resolve(false)
        }
    });
});
};

module.exports = {verifyAdmin, adminAccess};