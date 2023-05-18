import express from 'express';
import UsersModel from '../models/users.js';
const router = express.Router();
import bcrypt from 'bcrypt'

// POST
router.post('/login', async (req, res) => {
  
  const user = await UsersModel.findOne({
    email: req.body.email,
  });

  if(!user) {
    return res.status(404).send({
      message: "email o password non valida",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password) //parametri: password che scrive utente nel modulo login, password trovata con findOne() sopra
  if(!validPassword) {
    return res.status(400).send({
      message: "Password non valida" //solo a titolo di debug, dare un messaggio genericissimo
    })
  }
  return res.status(200).send({
    message: "Login effettuato con successo",
    payload: user //solo a titolo di debug, dare un messaggio genericissimo
  })

});

export default router;
