const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');
const controller = require('./controller');
const jwt = require('jsonwebtoken');


/*
* Create new user
*/
router.post('/createStudent', function (req, res) {
    const userInfo = {
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        class: req.body.class,
        birthday: req.body.birthday
    };

    bcrypt.hash(userInfo.password, 10)
        .then(function (encodePassword) {
            userInfo.password = encodePassword;
            controller.insertAuth([userInfo.id, userInfo.password], function (err, data) {
                if (err) {
                    console.log('Error while create new student', err);
                    res.json({code: 401, message: 'Cannot register by this id'})
                } else {
                    controller.insertStudent([userInfo.id, userInfo.username, userInfo.class, userInfo.birthday], function (err, data) {
                        if (err) {
                            console.log('Error while insert student', err);
                            res.json({code: 401, message: 'Cannot register by this id'})
                            // controller.deleteAuth(userInfo.id)
                        } else {
                            res.json({code: 400, message: 'Register successful'})
                        }
                    })
                }
            })
        })
});

router.post('/login', function (req, res) {
    const auth = {
        id: req.body.id,
        password: req.body.password
    }
    controller.findAuth(auth.id, function (err, data) {
        if (err) {
            res.status(401).json({message: 'Login failed'})
        }
        if (!data) {
            res.status(401).json({message: 'Incorrect id'})
        }
        console.log('auth', auth);
        console.log('user', data);
        bcrypt.hash(auth.password, 10)
            .then(function (encodePw) {
                if (bcrypt.compareSync(encodePw, data.password)) {
                    console.log('encodePw', encodePw);
                    res.status(401).json({message: 'Incorrect password'})
                } else {
                    controller.getStudent(auth.id, function (err, user) {
                        if (err) {
                            res.status(401).json({message: 'Login failed'})
                        } else {
                            const payload = {
                                id: user.rows[0].id,
                                name: user.rows[0].username
                            };
                            let token = jwt.sign(payload, 'secret-token', {
                                expiresIn: 1440 * 60
                            });
                            controller.saveToken(user.rows[0].id, token, function (err, data) {
                                if (err) {
                                    res.json({code: 401, message: 'Login failed'});
                                } else {
                                    res.status(400).json({message: 'Success', accessToken: token, user: user.rows[0]});
                                }
                            });
                        }
                    });
                }
            });
    })
});

router.use(function (req, res, next) {
    let token = req.query.token || req.body.token;
    let id = req.query.id || req.body.id;
    if (token) {
        controller.verifyToken(id, token, function (err, data) {
           if (err) {
               res.json({code: 401, message: 'Access token has expired'});
           } else {
               if (!data || !data.rows || data.rows.length === 0) {
                   res.json({code: 401, message: 'Access token has expired'});
               } else {
                   jwt.verify(token, 'secret-token', function (err, decoded) {
                       if (err) {
                           return res.json({code: 401, message: 'Access token has expired'});
                       } else {
                           req.decode = decoded;
                           next();
                       }
                   });
               }
           }
        });
    } else {
        return res.json({code: 401, message: 'Cannot find access token'});
    }
});

router.post('/getStudent', function (req, res) {
    console.log(typeof req.body.id);
    console.log(typeof req.decode.id);
    console.log(req.decode.id.trim() === req.body.id.trim());
    let isEqual = req.decode.id.trim() === req.body.id.trim();
    if (!isEqual) {
        res.json({code: 401, message: 'Access token is not valid'})
    } else if (!req.decode.id) {
        res.status(401).json({message: 'Invalid id'})
    } else if (!req.body.token) {
        res.status(401).json({message: 'Invalid token'})
    } else {
        controller.getStudent(req.decode.id, function (err, data) {
            if (err) {
                res.status(401).json({message: err})
            } else {
                res.json({code: 400, message: 'Success', student: data.rows[0]})
            }
        })
    }
});

module.exports = router;