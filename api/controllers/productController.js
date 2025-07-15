const db = require('../../db');
const { validationResult } = require('express-validator');
const config = require('../../config');

//try/catch para los metodos de la API

exports.getAllProducts = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products');
  if (rows.length === 0) {
    return res.status(404).json({ msg: 'No hay productos disponibles.' });
  }
  res.json(rows);
};

exports.getDeals = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE on_offer = true');
  if (rows.length === 0) {
    return res.status(404).json({ msg: 'No hay ofertas especiales disponibles.' });
  }
  res.json(rows);
}

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });
  res.json(rows[0]);
}

exports.createProduct = async (req, res) => {
  if (typeof req.body.on_offer === 'number') {
    req.body.on_offer = Boolean(req.body.on_offer);
  }
  if (typeof req.body.on_offer === 'string') {
    req.body.on_offer = req.body.on_offer === 'true' || req.body.on_offer === '1';
  }
  ['price', 'stock', 'offer_price', 'rating', 'rating_count'].forEach(field => {
    if (req.body[field] !== undefined) req.body[field] = Number(req.body[field]);
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    price,
    description,
    image,
    category,
    stock = 0,
    on_offer = false,
    offer_price = null,
    rating = 0,
    rating_count = 0
  } = req.body

  if (!title || !price || !description || !image || !category || !rating || !rating_count) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
  }

  const [existingProduct] = await db.execute('SELECT * FROM products WHERE title = ?', [title]);
  if (existingProduct.length > 0) {
    return res.status(400).json({ msg: 'El producto ya existe.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ msg: 'El precio debe ser un número positivo.' });
  }

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ msg: 'El título es obligatorio.' });
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ msg: 'La descripción es obligatoria.' });
  }

  // if (typeof image !== 'string' || image.trim() === '') {
  //   image = 'https://via.placeholder.com/150'; 
  // } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image)) {
  //   return res.status(400).json({ msg: 'La URL de la imagen debe ser válida.' });
  // }
  const [result] = await db.execute(
    `INSERT INTO products 
    (title, price, description, image, category, stock, on_offer, offer_price, rating, rating_count)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, price, description, image, category, stock, on_offer, offer_price, rating, rating_count]
  );

  res.status(201).json({
    id: result.insertId,
    title, price, description, image, category, stock, on_offer, offer_price, rating, rating_count
  });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: 'El ID del producto es obligatorio.' });
  
  const {
    title,
    description,
    image,
    price,
    category,
    stock = 0,
    on_offer = false,
    offer_price = null,
    rating = 0,
    rating_count = 0
  } = req.body;


  if (typeof req.body.on_offer === 'number') {
    req.body.on_offer = Boolean(req.body.on_offer);
  }
  if (typeof req.body.on_offer === 'string') {
    req.body.on_offer = req.body.on_offer === 'true' || req.body.on_offer === '1';
  }
  ['price', 'stock', 'offer_price', 'rating', 'rating_count'].forEach(field => {
    if (req.body[field] !== undefined) req.body[field] = Number(req.body[field]);
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!title || !price || !description || !image) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
  }

  const [existingProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  if (existingProduct.length === 0) {
    return res.status(404).json({ msg: 'Producto no encontrado.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ msg: 'El precio debe ser un número positivo.' });
  }

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ msg: 'El título es obligatorio.' });
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ msg: 'La descripción es obligatoria.' });
  }

  const [result] = await db.execute(
    `UPDATE products SET
    title = ?, price = ?, description = ?, image = ?, category = ?, stock = ?, on_offer = ?, offer_price = ?, rating = ?, rating_count = ?
   WHERE id = ?`,
    [title, price, description, image, category, stock, on_offer, offer_price, rating, rating_count, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });

  res.json({
    id,
    title,
    price,
    description,
    image,
    category,
    stock,
    on_offer,
    offer_price,
    rating,
    rating_count
  });
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

  if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });

  res.status(204).send();
}