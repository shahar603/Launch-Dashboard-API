function handleError(err, req, res, next){

    if (err.status === undefined){
        res.
            status(400).
            send({error: err.message});
    }else{
        res.
            status(err.status).
            send({error: err.message});
    }

    next();
}

module.exports = handleError;
