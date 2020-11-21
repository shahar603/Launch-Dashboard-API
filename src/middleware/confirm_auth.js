const router = require("express").Router();
const jwt = require("jsonwebtoken");
const tokens = require("../auth/tokens");

function checkAuth(req, res, next){
    let authorization = req.get("Authorization");

    if (!authorization || authorization.split(" ").length < 2){
        res.
        status(401).
        send({ error: "Unauthorized" });
        return;
    }
    
    const token = authorization.split(" ")[1];

    jwt.verify(token, tokens.pubKey, { algorithm: "RS256"}, (err, decoded) => {
        if (err){
            res.
            status(401).
            send({ error: "Unauthorized" });
        }
        else{
            next();
        }   
    });
}

router.post("*", checkAuth);
router.put("*", checkAuth);
router.delete("*", checkAuth);

module.exports = router;
