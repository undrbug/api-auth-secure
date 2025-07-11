const db = require('../../db');
const { validationResult } = require('express-validator');



exports.getAllProducts = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products');
  res.json(rows);
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });
  res.json(rows[0]);
}

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, price, description, image } = req.body;
    if (!title || !price || !description || !image) {
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

  if (typeof image !== 'string' || image.trim() === '') {
    image = 'https://via.placeholder.com/150'; 
  } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image)) {
    return res.status(400).json({ msg: 'La URL de la imagen debe ser válida.' });
  }
  const [result] = await db.execute('INSERT INTO products (title, price, description, image) VALUES (?, ?, ?, ?)', [title, price, description, image]);
  
  res.status(201).json({ id: result.insertId, title, price, description, image });
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, price, description, image } = req.body;
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

  if (typeof image !== 'string' || image.trim() === '') {
    image = 'https://via.placeholder.com/150'; 
  } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image)) {
    return res.status(400).json({ msg: 'La URL de la imagen debe ser válida.' });
  }
  
  const [result] = await db.execute('UPDATE products SET title = ?, price = ?, description = ?, image = ? WHERE id = ?', [title, price, description, image, id]);
  
  if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });
  
  res.json({ id, title, price, description, image });
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });
  
  res.status(204).send();
}