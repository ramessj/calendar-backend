const express = require('express');
const { dbConnection } = require('./database/config');

const cors = require('cors');

require('dotenv').config();

// CREAR EL SERVIDOR EXPRESS

const app = express();

//BASE DE DATOS

dbConnection();

//CORS

app.use(cors());

// DIRECTORIO PUBLICO

app.use(express.static('public'));

// LECTURA Y PARSEO DEL BODY

app.use(express.json());

// RUTAS

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//TODO CRUD: EVENTOS

// ESCUCHAR PETICIONES

app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
