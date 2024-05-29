const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST || 'monorail.proxy.rlwy.net', 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'zVeZzpomBQMVPHuCnilMnyIQXxyMEjvX',
  database: process.env.DB_DATABASE || 'railway',
  port: process.env.DB_PORT || 49600
};

async function getDatabaseConnection() {
  return await mysql.createConnection(dbConfig);
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Auto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del auto
 *           example: 1
 *         marca:
 *           type: string
 *           description: Marca del auto
 *           example: "Toyota"
 *         modelo:
 *           type: string
 *           description: Modelo del auto
 *           example: "Corolla"
 *         year:
 *           type: integer
 *           description: Año del auto
 *           example: 2018
 *         color:
 *           type: string
 *           description: Color del auto
 *           example: "Azul"
 */

/**
 * @swagger
 * tags:
 *  - name: Consultar
 *    description: Operaciones de consulta de Autos.
 *  - name: Agregar
 *    description: Operacion para agregar Auto.
 *  - name: Editar
 *    description: Operaciones de edición de Autos.
 *  - name: Eliminar
 *    description: Operacion para eliminar un Auto.
 */

function validarIdAuto(req, res, next) {
  const idAuto = req.params.idAuto;
  if (!idAuto || isNaN(idAuto)) {
    return res.status(400).json({ mensaje: "El parámetro idAuto es inválido" });
  }
  next();
}

/**
 * @swagger
 * /autos:
 *   get:
 *     summary: Obtiene todos los autos.
 *     tags: [Consultar]
 *     responses:
 *       200:
 *         description: Retorna la lista de autos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auto'
 *       500:
 *         description: Error en el servidor.
 */
router.get('/', async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results] = await connection.execute('SELECT * FROM autos');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /autos/{idAuto}:
 *   get:
 *     summary: Obtiene un auto por su ID.
 *     tags: [Consultar]
 *     parameters:
 *       - in: path
 *         name: idAuto
 *         required: true
 *         description: ID del auto a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna el auto solicitado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auto'
 *       404:
 *         description: El auto no fue encontrado.
 */
router.get('/:idAuto', validarIdAuto, async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results] = await connection.execute('SELECT * FROM autos WHERE id = ?', [req.params.idAuto]);

    if (results.length === 0) {
      return res.status(404).json({ resultado: "El auto no fue encontrado" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /autos:
 *   post:
 *     summary: Crea un nuevo auto.
 *     tags: [Agregar]
 *     requestBody:
 *       description: Datos del auto a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auto'
 *     responses:
 *       200:
 *         description: Auto creado exitosamente.
 *       400:
 *         description: Faltan campos obligatorios en la solicitud.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, year, color } = req.body;
    if (!marca || !modelo || !year || !color) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la solicitud" });
    }

    const connection = await getDatabaseConnection();
    const sentenciaSQL = 'INSERT INTO autos (marca, modelo, year, color) VALUES (?, ?, ?, ?)';
    const [results] = await connection.execute(sentenciaSQL, [marca, modelo, year, color]);
    res.status(200).json({ mensaje: "Auto creado exitosamente", id: results.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /autos/{idAuto}:
 *   put:
 *     summary: Actualiza un auto por su ID.
 *     tags: [Editar]
 *     parameters:
 *       - in: path
 *         name: idAuto
 *         required: true
 *         description: ID del auto a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos del auto a actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auto'
 *     responses:
 *       200:
 *         description: Auto actualizado exitosamente.
 *       400:
 *         description: Faltan campos obligatorios en la solicitud.
 *       404:
 *         description: El auto no fue encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.put('/:idAuto', validarIdAuto, async (req, res) => {
  try {
    const { marca, modelo, year, color } = req.body;
    if (!marca || !modelo || !year || !color) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la solicitud" });
    }

    const connection = await getDatabaseConnection();
    const sentenciaSQL = 'UPDATE autos SET marca = ?, modelo = ?, year = ?, color = ? WHERE id = ?';
    const [results] = await connection.execute(sentenciaSQL, [marca, modelo, year, color, req.params.idAuto]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "El auto no fue encontrado" });
    }

    res.status(200).json({ mensaje: "Auto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /autos/{idAuto}:
 *   delete:
 *     summary: Elimina un auto por su ID.
 *     tags: [Eliminar]
 *     parameters:
 *       - in: path
 *         name: idAuto
 *         required: true
 *         description: ID del auto a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Auto eliminado exitosamente.
 *       404:
 *         description: El auto no fue encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.delete('/:idAuto', validarIdAuto, async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results] = await connection.execute('DELETE FROM autos WHERE id = ?', [req.params.idAuto]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "El auto no fue encontrado" });
    }

    res.status(200).json({ mensaje: "Auto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = { router };
