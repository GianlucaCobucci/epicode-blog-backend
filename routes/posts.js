const router = express.Router();
import express from 'express';
import PostModel from '../models/posts.js';

//GET
router.get('/posts', async (req, res) => {

    const { page = 1, pageSize = 8 } = req.query

    try {
        const posts = await PostModel.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        const totalPosts = await PostModel.count()

        res.status(200).send({
            statusCode: 200,
            count: totalPosts,
            currentPage: +page,
            totalPage: Math.ceil(totalPosts / pageSize),
            posts
        })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

//GET
router.get('/posts/bytitle/:title', async (req, res) => {
    try {
        const { title } = req.params
        const postByTitle = await PostModel.find({
            title: {
                $regex: '.*' + title + '.*', //controlla da inizio a fine stringa e cerca la query del parametro
                $options: 'i' //insensitive, non fare distinzione tra maiuscole e minuscole
            }
        })
        if (!postByTitle || postByTitle.length === 0) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: "Non esiste post con questo titolo"
                })
        }
        res.status(200).send({
            message: "Post trovato",
            statusCode: 200,
            postByTitle
        })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

//POST
router.post('/posts', async (req, res) => {
    console.log(req.body);

    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        rate: req.body.rate
    })

    try {
        await post.save()
        res.status(201)
            .send({
                statusCode: 200,
                message: "Post salvato con successo nel database"
            })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "C'è un errore nell'invio del post"
            })
    }
})

//PATCH
router.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const postExist = await PostModel.findById(id)
    if (!postExist) {
        return res.status(404).send({
            message: "Post inesistente",
            statusCode: 404
        })
    }
    try {
        const postID = id;
        const dataUpdated = req.body;
        const options = { new: true }
        const result = await PostModel.findByIdAndUpdate(postID, dataUpdated, options)
        res.status(200).send({
            message: "Post trovato e modificato",
            statusCode: 200,
            result
        })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

//DELETE
router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postExist = await PostModel.findByIdAndDelete(id)
        if (!postExist) {
            return res.status(404).send({
                message: "Post inesistente",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: `Post con ${id} rimosso dal database`,
            statusCode: 200
        })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore interno del server"
            })
    }
})

export default router