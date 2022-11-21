import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10) // генеруєм метод шифрування
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save()

        const token = jwt.sign({ // інформація яку треба зашифрувати
            _id: user._id
        },
            'secret123', // ключ шифрування
            {
                expiresIn: '30d' // час життя токена (30 днів)
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось зареєструватись"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                message: "Користувача не найдено"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: "Неправильний логін або пароль"
            })
        }

        const token = jwt.sign({
            _id: user._id
        },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось авторизуватись"
        })
    }
}

export const getMe = async(req, res) =>{
    try{
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Користувача не найдено'
            })
        }

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData
        })
    }catch(e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось"
        })
    }
}