const Router =  require ("express")
const router = new Router()
const controller =  require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
router.post('/registration', [
    check('username', 'Имя не может быть пустым').notEmpty(),
    check('password', 'Пороль должен быть больше 4 и меньше 10 символов').isLength({min: 4, max: 10}),
    controller.registration]  )
router.post('/login', controller.login)
router.get('/users',  roleMiddleware(['USER']), controller.getUsers)
router.get('/install', controller.install)

module.exports = router