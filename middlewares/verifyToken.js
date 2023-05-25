import jsonwebtoken from 'jsonwebtoken';

const verifyToken = (req, res, next) => {

    const token = req.header("auth")//vediamo se header c'è "Authorization"
    if(!token){
        return res.status(401).send({
            errorType: "Token non presente",
            statusCode: 401,
            message: "Per poter usare l'endpoint è necessario il token d'accesso"
        })
    }

    try {
        const verify = jwt.verify(token, process.env.SECRET_JWT_KEY)
        req.user = verify
        next()
    } catch (error) {
        res.status(403).send({
            errorType: "Token error",
            statusCode: 403,
            message: "Token non valido o scaduto"
        })
    }
}


export default verifyToken