const express = require('express');
const router = new express.Router();
const UserController = require('./../models/user/user.controller')();
// const auth = require('./../middleware/auth');

router.post('/login', (req, res) => {
    UserController.auth(req.body.userData).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    });
});

router.post('/save', (req, res) => {
    UserController.save(req.body.userData).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/all', (req, res) => {
    UserController.load(req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
        });
});

router.post('/logout', (req, res) => {
    UserController.removeToken(req.body.userData).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    });
});

module.exports = router;
