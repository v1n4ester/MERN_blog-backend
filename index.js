import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import {UserControllers, PostControllers} from './controllers/index.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import { registerValidation, loginValidation } from './validators/auth.js'
import {postCreateValidation} from './validators/post.js'
import cors from 'cors'


mongoose.connect('mongodb+srv://admin:wwwwww@blogcluster.4lgd8mj.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch(e => console.log('DB error', e))

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => { // куда записувати
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => { // під якою назвою записувати
        cb(null, file.originalname)
    },
})

const upload = multer({ storage }) // створюєм хранилище
app.post('/upload', checkAuth, upload.single('image'),  // осікуєм файл з назвою image
 (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
}) 

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login)

app.post('/auth/register', registerValidation, handleValidationErrors, UserControllers.register)

app.get('/auth/me', checkAuth, UserControllers.getMe)

app.get('/posts', PostControllers.getAll)
app.get('/posts/tags', PostControllers.getLastTags)
app.get('/posts/:id', PostControllers.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostControllers.create)
app.delete('/posts/:id', checkAuth, PostControllers.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostControllers.update)

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Server OK!')
});
