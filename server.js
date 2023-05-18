import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import usersRoute from  './routes/users.js'
import loginRoute from  './routes/login.js'
const PORT = 5050;

const app = express();

//middleware
app.use(express.json());
app.use(cors());//abilita il server a ricevere richieste da qualsiasi origine

//rotte
app.use('/', usersRoute)
app.use('/', loginRoute)
mongoose.connect('mongodb+srv://gianlucacobucci330:NCSqDtPaS64quRyy@d2-epicode.zh88ndo.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Errore di connessione al server DB'))
db.once('open', ()=>{console.log('Server DB connesso correttamente')})

app.listen(PORT, ()=>console.log(`Server avviato sulla porta ${PORT}`))

