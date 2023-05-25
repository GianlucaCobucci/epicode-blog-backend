const logger = (req, res, next) =>{
    const {url, ip, method} = req
    console.log(`${new Date().toISOString()} Effettuata richiesta ${method} all'endpoint ${url} dall'indirizzo ip ${ip}` )

    next()
}

export default logger
