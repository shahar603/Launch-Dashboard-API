const router = require("express").Router();

function checkAuth(req, res, next){
    if(!req.user){
        res.
        status(401).
        send({ error: "Unauthorized" });
    }else{
        next();
    }
}

router.post("*", checkAuth);
router.put("*", checkAuth);
router.delete("*", checkAuth);

module.exports = router;
