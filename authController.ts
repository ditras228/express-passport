import {validationResult} from 'express-validator'

const User = require('./modules/User')
const Role = require('./modules/Role')
const bcrypt = require('bcryptjs')
import jwt = require('jsonwebtoken')

require('dotenv').config();

const generateAccessToken = (id, roles)=>{
    const payload={
        id,
        roles
    }
    return jwt.sign(payload,  process.env.SECRET, {expiresIn: '24h'})
}
class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if(candidate){
                return res.status(400).json({message: 'Ник занят'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole= await Role.findOne({value: 'USER'})
            const user = new User({username, password: hashPassword, roles:[userRole.value]})
            await user.save()
            return res.json({message: 'Пользователь успешно зарегистрирован'})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration failed'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message: 'Введен не верный пороль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login failed'})
        }
    }

    async install(req, res) {
        try {
            const userRole = new Role()
            const adminRole = new Role({value: 'ADMIN'})
            await userRole.save()
            await adminRole.save()
        } catch (e) {
            console.log(e)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)

        }
    }
}

module.exports = new authController()