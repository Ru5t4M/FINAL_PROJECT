const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const {adminAccess} = require("../utils/verifyToken")

let dbase;

function handleDisconnect() {
  dbase = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'sakso134$', 
    database: 'app' 
  });

  dbase.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); 
    } else {
      console.log('Connected to MySQL');
    }
  });

  dbase.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); 
    } else {
      throw err;
    }
  });
}

handleDisconnect();

const createProduct = (req, res)=>{
    const { name, description, stock,category,price,image_url } = req.body;

    const query = `INSERT INTO product (name, description, stock, category, price, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
  
    dbase.query(query, [name, description, stock,category,price,image_url], (err, results) => {
      if (err) {
        console.error('Error inserting product:', err);
        res.status(500).send('Error inserting product');
        return;
      }
      res.status(201).send(`Product added with ID: ${results.insertId}`);
    });
}

const getProducts = async (req, res) => {
  let isAdmin = false;
  let hasToken = false;
  const token = req.cookies.token;

    if (token) {
      hasToken = true;
      try {
        isAdmin = await adminAccess(req);
        } catch (err) {
          console.error('Error checking admin access:', err);
        }
    }

    const query = 'SELECT * FROM product';

    dbase.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error fetching products');
            return;
        }
        res.status(200).render("products", { products: results, isAdmin, hasToken });
    });
}


const deleteProduct = (req, res) => {
  const { id } = req.params;

  dbase.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).json({ message: 'Error starting transaction' });
      return;
    }

    dbase.query('DELETE FROM favorites WHERE product_id = ?', [id], (err) => {
      if (err) {
        return dbase.rollback(() => {
          console.error('Error deleting from favorites:', err);
          res.status(500).json({ message: 'Error deleting from favorites' });
        });
      }

      dbase.query('DELETE FROM product WHERE id = ?', [id], (err, results) => {
        if (err) {
          return dbase.rollback(() => {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Error deleting product' });
          });
        }

        if (results.affectedRows === 0) {
          return dbase.rollback(() => {
            res.status(404).json({ message: 'Product not found' });
          });
        }

        dbase.commit(err => {
          if (err) {
            return dbase.rollback(() => {
              console.error('Error committing transaction:', err);
              res.status(500).json({ message: 'Error committing transaction' });
            });
          }

          res.status(200).json({ message: `Product with ID: ${id} deleted` });
        });
      });
    });
  });
};


const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, stock, category, price, image_url } = req.body;

  const query = `UPDATE product 
                 SET name = ?, description = ?, stock = ?, category = ?, price = ?, image_url = ? 
                 WHERE id = ?`;

  dbase.query(query, [name, description, stock, category, price, image_url, id], (err, results) => {
      if (err) {
          console.error('Error updating product:', err);
          res.status(500).send('Error updating product');
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send('Product not found');
          return;
      }

      res.status(200).send(`Product with ID: ${id} updated`);
  });
}

const getProductById = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM product WHERE id = ?';

  dbase.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error fetching product:', err);
          res.status(500).send('Error fetching product');
          return;
      }

      if (results.length === 0) {
          res.status(404).send('Product not found');
          return;
      }

      res.status(200).render("edit", {product: results[0]});
  });
};

module.exports = {createProduct, getProducts, deleteProduct, updateProduct, getProductById};