const mysql = require('mysql2');

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

const addFavorite = (req, res) => {
  const { productId } = req.params;

  const query = 'INSERT INTO favorites (product_id) VALUES (?)';

  dbase.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error adding product to favorites:', err);
      res.status(500).send('Error adding product to favorites');
      return;
    }
    res.status(201).send(`Product added to favorites with ID: ${results.insertId}`);
  });
};

const getFavorites = (req, res) => {
  const token = req.cookies.token;
  const hasToken = !!token;
  const query = `
    SELECT p.id, p.name, p.description, p.stock, p.category, p.price, p.image_url 
    FROM product p 
    JOIN favorites f ON p.id = f.product_id
  `;

  dbase.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching favorite products:', err);
      res.status(500).send('Error fetching favorite products');
      return;
    }
    res.status(200).render('favorites', { products: results, hasToken });
  });
};

const deleteFavorite = (req, res) => {
  const { productId } = req.params;

  const query = 'DELETE FROM favorites WHERE product_id = ?';

  dbase.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error deleting favorite product:', err);
      res.status(500).send('Error deleting favorite product');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Favorite product not found');
      return;
    }

    res.status(200).json({ success: true, message: `Favorite product with ID: ${productId} deleted` });
  });
};

module.exports = { addFavorite, getFavorites, deleteFavorite };
