function handleError(err, req, res, next){
    res.
        status(422).
        send({error: err._message});

    next();
}


module.exports = handleError;
