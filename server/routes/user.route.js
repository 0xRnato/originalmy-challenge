module.exports = (app, db) => {
    const express = require('express');
    const router = new express.Router();
    const UserController = require('./../models/user/user.controller')(db);
    const auth = require('./../middleware/auth');

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

    router.get('/all', auth, (req, res) => {
        UserController.load(req.body)
            .then((data) => {
                res.send(data);
            })
            .catch((error) => {
                res.send(error);
            });
    });

    router.post('/logout', auth, (req, res) => {
        UserController.removeToken(req.body.userData).then((data) => {
            res.send(data);
        }).catch((error) => {
            res.send(error);
        });
    });

    app.use('/api/user', router);
};
