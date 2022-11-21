import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String,

}, { // властивості при створенні кожної моделі
    timestamps: true, // добавлення часу створення і обновлення моделі
})

export default mongoose.model('User', UserSchema)