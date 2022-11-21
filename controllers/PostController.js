import PostModel from '../models/post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось получити статтю"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec() // получаєм останні 5 статтей

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось получити статтю"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate({
            _id: postId

        },
            { // то що ми хочемо обновити в найденій моделі
                $inc: { 'viewsCount': 1 } //  збільшуєм на 1
            },
            { // опція що ми хочемо зробити 
                new: true,// поверне нам обновлену  модель
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Не получилось получити статтю"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Стаття не найдена'
                    })
                }

                res.json(doc)
            }).populate('user')
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось получити статтю"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                console.log(e)
                res.status(500).json({
                    message: "Не получилось видалити статтю"
                })
            }

            if (!doc) {
                console.log(e)
                res.status(404).json({
                    message: "Не получилось получити статтю"
                })
            }

            res.json({
                success: true
            })
        });


    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось получити статтю"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось створити статтю"
        })
    }
}

export const update = async(req, res) => {
    try{
        const postId = req.params.id

        await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text, // якщо не передати то просто не поміняється значення
            imageUrl: req.body.imageUrl,
            user: req.body.userId,
            tags: req.body.tags.split(','),
        })

        res.json({
            success: true
        })
    }catch(e) {
        console.log(e)
        res.status(500).json({
            message: "Не получилось обновити статтю"
        })
    }
}