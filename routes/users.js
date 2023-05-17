import express from 'express'
import UsersModel from '../models/users.js'
const router = express.Router()

//GET
router.get('/users', async(req,res)=>{
    try {
        const users = await UsersModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500)
        .send({
            message: 'Errore interno del server'
        })
    }
})

//POST
router.post('/users', async(req,res)=>{
    const user = new UsersModel({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const userExist = await UsersModel.findOne({email:req.body.email})
        if (userExist){
            return res.status(409)
            .send({
                message:'email già esistente'
            })
        }
        const newUser = await user.save();
        res.status(201).send({
            message: 'user registered',
            payload: newUser
        })
    } catch (error) {
        res.status(500)
        .send({
            message:'errore interno del server'
        })
    }
})

//PATCH
router.patch('/users/:id', async(req,res)=>{
    const {id} = req.params;
    const userExist = await UsersModel.findById(id)
    if (!userExist){
        return res.status(404).send({
            message: 'utente inesistente'
        })
    }
    try {
        const userID = id;
        const dataUpdated = req.body;
        const options = {new: true}
        const result = await UsersModel.findByIdAndUpdate(userID, dataUpdated, options)
        res.status(200).sendStatus({
            message: 'User modified',
            payload: result
        })
    } catch (error) {
        res.status(500)
        .send({
            message: 'Errore interno del server'
        })
    }
})


export default router

