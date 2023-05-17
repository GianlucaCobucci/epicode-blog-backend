import express from 'express';
import UsersModel from '../models/users.js';

const router = express.Router();

// POST
router.post('/login', async (req, res) => {
  try {
    const user = await UsersModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send({
        message: 'Utente non trovato',
      });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Errore del server',
    });
  }
});

export default router;
