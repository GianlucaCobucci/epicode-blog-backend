import express from 'express';
import UsersModel from '../models/users.js';
const router = express.Router();
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';

// POST
router.post('/login', async (req, res) => {
  
  const user = await UsersModel.findOne({
    email: req.body.email,
  });

  if(!user) {
    return res.status(404).send({
      message: "email o password non valida",
      statusCode: 404
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password) //parametri: password che scrive utente nel modulo login, password trovata con findOne() sopra
  if(!validPassword) {
    return res.status(400).send({
      message: "Password non valida", //solo a titolo di debug, dare un messaggio genericissimo
      statusCode: 400
    })
  }

  //utilizziamo token da mandare al frontend
  const token = jsonwebtoken.sign({email: user.email}, process.env.SECRET_JWT_KEY, {expiresIn: "24h"})

  res.header('Authorization', token).status(200).send({
    token,
    statusCode: 200,
    message: "Login effettuato con successo"
    /* 
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age
    */
  })

});

export default router;
