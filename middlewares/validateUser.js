const validateUser = (req, res, next) => {
    const errors = []
    const {userName, email, password} = req.body

    if (typeof userName !== "string"){
        errors.push("Il nome deve essere una stringa valida")
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Per favore metti una mail valida")
    }

    if (typeof password !== "string" || password.length < 8){
        errors.push("Password deve essere una stringa o avere almeno 8 caratteri")
    }

    if (errors.length > 0){
        res.status(400).send({errors})
    } else {
        next()
    }
}

export default validateUser