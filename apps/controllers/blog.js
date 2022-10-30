var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    res.json({'message': 'this is Blog Page'})
})

module.exports = router;