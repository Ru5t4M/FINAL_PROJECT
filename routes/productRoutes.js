const router = require("express").Router();
const {createProduct, getProducts, deleteProduct, updateProduct, getProductById} = require("../controllers/productController")
const { verifyAdmin } = require("../utils/verifyToken");
const fs = require("fs");


router.get("/", getProducts)
router.post("/", verifyAdmin, createProduct);
router.delete("/:id", verifyAdmin, deleteProduct);
router.put("/:id", verifyAdmin, updateProduct);
router.get("/edit/:id", verifyAdmin, getProductById);

module.exports = router;

