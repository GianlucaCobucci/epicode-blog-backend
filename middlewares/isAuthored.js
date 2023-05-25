const isAuthored= (req, res, next) => {
    
    const role = req.body

    if(role !== 'admin') {
        return res.status(400).send({
            message: "L'utente non è autorizzato"
        })
    }
    next()
}

export default isAuthored