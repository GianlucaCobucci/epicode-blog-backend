import express from 'express'
import UsersModel from '../models/users.js'
const router = express.Router()
import bcrypt from 'bcrypt' 

//GET
router.get('/users', async(req,res)=>{
    const {page = 1, pageSize = 3} = req.query /* queste sono le query che stanno nell'url*/
    try {
        const users = await UsersModel.find()
        .limit(pageSize)/* limita i valori che mi ritorni alla pageSize */
        .skip((page  - 1) * pageSize)

        const totalUsers = await UsersModel.count()/* conteggio tutti utenti dentro la collection */

        res.status(200).send({
            count : totalUsers,
            currentPage: +page, /* equivalente a Number(page) */
            totalPage: Math.ceil(totalUsers / pageSize), 
            users
        })
    } catch (error) {
        res.status(500).send({
            message: 'Errore interno del server'
        })
    }
})

// con find() trovo tutti i documenti in una collection -> UsersModel
// questa query può essere arricchita -> con UsersModel.find({email: "gianlucacobucci330@gmail.com"})
/* posso avere più chiavi-valori -> 

    UsersModel.find(
        {email: "gianlucacobucci330@gmail.com",
        age: 2
    })
*/

//controllare valori tramite operatori
/* 
UsersModel.find({age: {$gt: 18}}) //gt -> greater than
UsersModel.find({age: {$lt: 18}}) //lt -> lower than
UsersModel.find({age: {$gre: 18}}) //gre -> greater than or equal to
UsersModel.find({age: {$lte: 18}}) //lte -> lower than or equal to
*/

//ordinamento
/* 
UsersModel.find({email: "gian@gmail.com"}).sort({age: 1}) //ritorna tutto database con quella mail ma ordinato per età
*/

//query per trovare documenti che soddisfano criterio di corrispondenza con operatori logici
/* 
UsersModel.find({ //ritorna query o con utenti con quel nome o con quell'età
    $or:[
    {
        age: 18
    },
    {
        firstName: "Ciccio"
    }
    ] 
})
*/

//POST
const  saltRounds = 10;
const myPlaintextPassword = '';

router.post('/users', async(req,res)=>{

    //hash password
    const genSalt = await bcrypt.genSalt(10) /* algoritmo decrittazzione */
    const hashPassword = await bcrypt.hash(req.body.password, genSalt)

    const user = new UsersModel({
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword
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
            message: 'Utente registrato',
            payload: newUser
        })
    } catch (error) {
        res.status(500)
        .send({
            message:'Errore interno del server'
        })
    }
})

//PATCH
router.patch('/users/:id', async(req,res)=>{
    const {id} = req.params;
    const userExist = await UsersModel.findById(id)
    if (!userExist){
        return res.status(404).send({
            message: 'Utente inesistente'
        })
    }
    try {
        const userID = id;
        const dataUpdated = req.body;
        const options = {new: true}
        const result = await UsersModel.findByIdAndUpdate(userID, dataUpdated, options)
        res.status(200).sendStatus({
            message: 'Utente modificato',
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

