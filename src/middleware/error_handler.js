function handleError(err, req, res, next){
    res.
        status(422).
        send({error: err.message});

    next();
}


module.exports = handleError;
