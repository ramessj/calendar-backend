const { Router } = require('express');

const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
} = require('../controllers/events');

const router = Router();

//todas tienen q pasr por la validacion del jwt

router.use(validarJWT);

//obtener eventos
router.get('/', getEventos);

//crear evento
router.post(
	'/',
	[
		check('title', 'El titulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
		validarCampos,
	],

	crearEvento
);

//actualizar evento
router.put('/:id', actualizarEvento);

//borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
