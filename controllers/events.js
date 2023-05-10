const { response, request } = require('express');

const Evento = require('../models/Evento-model');

const getEventos = async (req, res = response) => {
	const eventos = await Evento.find().populate('user', 'name');

	res.json({
		ok: true,
		msg: eventos,
	});
};

const crearEvento = async (req = request, res = response) => {
	const evento = new Evento(req.body);

	try {
		evento.user = req.uid;

		const eventoGuardado = await evento.save();

		res.status(201).json({
			ok: true,
			evento: eventoGuardado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error, comuniquese con el administrador',
		});
	}
};

const actualizarEvento = async (req, res = response) => {
	const eventoId = req.params.id;

	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'el evento no existe con ese id',
			});
		}

		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene permisos para editar este evento',
			});
		}

		const nuevoEvento = {
			...req.body,
			user: uid,
		};

		const eventoActualizado = await Evento.findByIdAndUpdate(
			eventoId,
			nuevoEvento,
			{
				new: true,
			}
		);

		res.status(201).json({
			ok: true,
			evento: eventoActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

const eliminarEvento = async(req, res = response) => {
	const eventoId = req.params.id;

	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'el evento no existe con ese id',
			});
		}

		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene permisos para eliminar este evento',
			});
		}

		
		const eventoEliminado = await Evento.findByIdAndRemove( eventoId )

		res.status(201).json({
			ok: true,
			evento: eventoEliminado
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'hable con el administrador',
		});
	}
};

module.exports = {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
};
