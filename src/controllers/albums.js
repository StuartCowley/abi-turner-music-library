const db = require('../../src/db/index.js');

const createAlbum = async (req, res) => {
  const { name, date } = req.body;
  const { id } = req.params;

  try {
    const {
      rows: [album],
    } = await db.query(
      'INSERT INTO Albums (name, date, artistid) VALUES ($1, $2, $3) RETURNING *',
      [name, date, id]
    );
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const readAlbum = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Albums');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [album],
    } = await db.query('SELECT * FROM Albums WHERE id = $1', [id]);

    if (!album) {
      res.status(404).json({ message: `Albums ${id} does not exist` });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateAlbum = async (req, res) => {
  const { id } = req.params;
  const { name, date, artistid } = req.body;

    let query;
    let params;

  if (name && date && artistid) {
    query = `UPDATE Albums SET name = $1, date = $2 WHERE id = $3 RETURNING *`;
    params = [name, date, artistid, id];
  } else if (name && date) {
    query = `UPDATE Albums SET name = $1, date = $2 WHERE id = $3 RETURNING *`;
    params = [name, date, id];
  } else if (date && artistid) {
    query = `UPDATE Albums SET date = $1, artistid = $2 WHERE id = $3 RETURNING *`;
    params = [date, artistid, id];
  } else if (!name && !date) {
      query = 'UPDATE Albums SET artistid = $1 WHERE id = $2 RETURNING *';
      params = [artistid, id];
  } else if (!artistid && !date) {
      query = 'UPDATE Albums SET name = $1 WHERE id = $2 RETURNING *';
      params = [name, id];
  } else if (!name && !artistid) {
      query = 'UPDATE Albums SET date = $1 WHERE i d= $2 RETURNING *';
      params = [date, id];
  }

  try {
    const {
      rows: [album],
    } = await db.query(query, params);

    if (!album) {
      res.status(404).json({ message: `Album ${id} does not exist` });
    }

    res.status(200).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteAlbum = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [album],
    } = await db.query(`DELETE FROM Albums WHERE id = $1 RETURNING *`, [id]);

    if (!album) {
      res.status(404).json({ message: `Album ${id} does not exist` });
    }

    res.status(200).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  createAlbum,
  readAlbum,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
};
