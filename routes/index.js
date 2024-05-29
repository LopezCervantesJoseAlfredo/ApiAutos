const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'monorail.proxy.rlwy.net', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'zVeZzpomBQMVPHuCnilMnyIQXxyMEjvX',
    database: process.env.DB_DATABASE || 'railway',
    port: process.env.DB_PORT || 49600
});

/**
 * @swagger
 * tags:
 *   name: Autos
 *   description: Endpoints relacionados con autos
 */

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
 *         marca:
 *           type: string
 *           description: Marca del auto
 *         modelo:
 *           type: string
 *           description: Modelo del auto
 *         year:
 *           type: integer
 *           description: Año del auto
 */

/**
 * @swagger
 * /autos:
 *   get:
 *     summary: Obtener todos los autos o un auto específico por ID
 *     tags: [Autos]
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID del auto a buscar (opcional)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna los datos de los autos.
 */

router.get('/redoc', Redoc(options));

router.get('/autos/:id?', (req, res, next) => {
    try {
        const autoID = req.params.id;
        let sql = `SELECT * FROM autos`;
        let params = [];

        if (autoID) {
            sql += ` WHERE id = ?`;
            params.push(autoID);
        }
        pool.execute(sql, params, function (err, results, fields) {
            if (err) {
                res.status(404).json({ error: 'Data not found' });
                return;
            } else {
                res.send(results);
            }
        });
    } catch (err) {
        res.status(500).send(err.code + ' / ' + err.message);
    }
});

/**
 * @swagger
 * /autos:
 *   post:
 *     summary: Agregar un nuevo auto
 *     tags: [Autos]
 *     requestBody:
 *       description: Datos del auto a agregar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auto'
 *     responses:
 *       200:
 *         description: Nuevo auto agregado exitosamente.
 *       400:
 *         description: Se requieren todos los datos para agregar un nuevo auto.
 */

router.post('/autos', (req, res, next) => {
    try {
        const { marca, modelo, year } = req.body;
        let params = [marca, modelo, year];
        let sql = `INSERT INTO autos (marca, modelo, year) values (?, ?, ?)`;
        if (!marca || !modelo || !year) {
            res.status(400).send('Se requieren todos los datos para agregar un nuevo auto');
            return;
        }
        pool.execute(sql, params, function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: 'No es posible agregar el auto' });
                return;
            } else {
                res.send('Nuevo auto agregado correctamente');
            }
        });
    } catch (err) {
        res.status(500).send(err.code + ' / ' + err.message);
    }
})

/**
 * @swagger
 * /autos/{id}:
 *   put:
 *     summary: Actualizar un auto existente
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del auto a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nuevos datos del auto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auto'
 *     responses:
 *       200:
 *         description: Auto actualizado correctamente.
 *       400:
 *         description: Se requieren todos los datos para actualizar un auto.
 */

router.put('/autos/:id', (req, res, next) => {
    const autoID = req.params.id;
    const { marca, modelo, year } = req.body;
    let sql = 'UPDATE autos SET marca = ?, modelo = ?, year = ? WHERE id = ?';

    if (!marca || !modelo || !year) {
        res.status(400).send('Se requieren todos los datos para actualizar un auto');
        return;
    }

    pool.query(sql, [marca, modelo, year, autoID], function (err, results, fields) {
        if (err) {
            res.status(500).json({ error: 'No es posible modificar el auto' });
            return;
        } else {
            res.send(`Auto ${autoID} modificado correctamente`);
        }
    })
})

/**
 * @swagger
 * /autos/{id}:
 *   delete:
 *     summary: Eliminar un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del auto a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente.
 *       400:
 *         description: Se requiere un ID para eliminar un auto.
 */

router.delete('/autos/:id', (req, res, next) => {
    try {
        const autoID = req.params.id;
        let sql = `DELETE FROM autos WHERE id = ${autoID}`;
        if (!autoID) {
            res.status(400).send('Se debe colocar un ID para eliminar un auto.');
            return;
        }
        pool.execute(sql, function (err, results, fields) {
            if (err) {
                res.status(500).json({ error: 'Error al eliminar el auto' });
                return;
            } else {
                res.send(`Registro ${autoID} eliminado correctamente`);
            }
        });
    } catch (err) {
        res.status(500).send(err.code + ' / ' + err.message);
    }
});

module.exports = router;
