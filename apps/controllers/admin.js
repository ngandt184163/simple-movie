var express = require('express');

var router = express.Router();

var user_md = require('../models/user');

var helper = require('../helpers/helper');

router.get('/', function(req, res){
    res.json({'message': 'this is Admin Page'})
})

router.get('/signup', function(req, res){
    res.render('signup', {data: {}});
});

router.post('/signup', function(req, res){
    var user = req.body;

    if(user.email.trim().length == 0){
        res.render('signup', {data: {error: 'Email is required'}});
    }
    if(user.pwd != user.repwd && user.pwd.trim().length != 0){
        res.render('signup', {data: {error: 'password is not match'}});
    }

    // insert to db
    var password = helper.hash_password(user.pwd);
    user = {
        email: user.email,
        password: password,
        first_name: user.first_name,
        last_name: user.last_name
    }

    var result = user_md.addUser(user);

    result.then(function(data){
        // res.json({message: 'chen du lieu vao db thanh cong'});
        res.redirect('/admin/signin');
    }).catch(function(err){
        res.render('signup', {data: {error: 'chen du lieu vao db  that bai'}});
    })

    // if(!result){
    //     res.render('signup', {data: {error: 'chen du lieu vao db  that bai'}});
    // }else{
    //     res.json({message: 'chen du lieu vao db thanh cong'});
    // }
    
});


router.get('/signin', function(req, res){
    res.render('signin', {data: {}});
});

router.post('/signin', function(req, res){
    var params = req.body;

    if(params.email.trim().length == 0){
        res.render('signin', {data: {error: 'Email is required'}});
    }else{
        var data = user_md.getUserByEmail(params.email);
        // console.log(data);

        if(data){
            data.then(function(users){
                var user = users[0];

                console.log(user);

                // var status = helper.compare_password(params.pwd, user.password);
                var status = (params.pwd === user.password) ? true : false;
                console.log(status);
                if(status){
                    req.session.user = user;
                    console.log()
                    res.redirect('/admin/');
                }else{
                    res.render('signin', {data: {error: 'Password wrong'}});
                }
            })
        }else{
            res.render('signin', {data: {error: 'User not exitst'}});
        }
    }
    // if(param.pwd != param.repwd && param.pwd.trim().length != 0){
    //     res.render('signup', {data: {error: 'password is not match'}});
    // }

    // // insert to db
    // var password = helper.hash_password(param.pwd);
    // param = {
    //     email: param.email,
    //     password: password,
    //     first_name: param.first_name,
    //     last_name: param.last_name
    // }

    // var result = user_md.addUser(user);

    // result.then(function(data){
    //     res.json({message: 'chen du lieu vao db thanh cong'});
    // }).catch(function(err){
    //     res.render('signup', {data: {error: 'chen du lieu vao db  that bai'}});
    // })

});

module.exports = router;