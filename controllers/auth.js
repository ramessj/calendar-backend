const { response } = require('express');

const Usuario = require('../models/Usuario-model');

const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');

// CREACION DE USUARIO

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Ya existe un usuario con ese correo',
			});
		}

		usuario = new Usuario(req.body);

		//encriptar contraseña

		const salt = bcrypt.genSaltSync();

		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		//generar JWT

		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Algo salió mal, comuniquese con el administrador',
		});
	}
};

// LOGIN DE USUARIO

const loginUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El usuario no existe con ese email',
			});
		}

		//confirmar match de password

		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Contraseña incorrecta',
			});
		}

		//generar nuesto JWT jason web token

		const token = await generarJWT(usuario.id, usuario.name);

		// si todo sale bien

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Algo salió mal, comuniquese con el administrador',
		});
	}
};

// REVALIDAR TOKEN

const revalidarToken = async (req, res = response) => {
	const { uid, name } = req;

	//generar un nuevo JWT y retornarlo en esta peticion

	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
		uid,
		name,
		token,
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken,
};
