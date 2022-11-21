import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Неправильний формат пошти').isEmail(), // якщо email правильний то не буде помилки
    body('password', 'Пароль має бути мінімум 5 символів').isLength({min: 5}),
    body('fullName', 'Неправильне ім`я').isLength({min: 3}),
    body('avatarUrl', 'Неправильна ссилка').optional().isURL() // якщо нічого не буде то не видасть помилки
]

export const loginValidation = [
    body('email', 'Неправильний формат пошти').isEmail(), 
    body('password', 'Пароль має бути мінімум 5 символів').isLength({min: 5}),
]