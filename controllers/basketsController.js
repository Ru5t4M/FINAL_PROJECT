const mysql = require('mysql2');

let dbase;

function handleDisconnect() {
  dbase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'salam123',
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

const addBasket = (req, res) => {
  const { productId } = req.params;

  const query = 'INSERT INTO basket (product_id) VALUES (?)';

  dbase.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error adding product to basket:', err);
      res.status(500).send('Error adding product to basket');
      return;
    }
    res.status(201).redirect('/baskets'); 
  });
};

const getBaskets = (req, res) => {
  const query = `
    SELECT p.id, p.name, p.description, p.stock, p.category, p.price, p.image_url 
    FROM product p 
    JOIN basket b ON p.id = b.product_id
  `;

  dbase.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching basket products:', err);
      res.status(500).send('Error fetching basket products');
      return;
    }
    res.status(200).render('baskets', { products: results });
  });
};

const deleteBasket = (req, res) => {
  const { productId } = req.params;

  const query = 'DELETE FROM basket WHERE product_id = ?';

  dbase.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error deleting basket product:', err);
      res.status(500).send('Error deleting basket product');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Basket product not found');
      return;
    }

    res.status(200).redirect('/baskets'); 
  });
};

module.exports = { addBasket, getBaskets, deleteBasket };
