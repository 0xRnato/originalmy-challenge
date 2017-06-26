module.exports = (app, db) => {
    const express = require('express');
    const router = new express.Router();
    const UserController = require('./../models/user/user.controller')(db);
    const auth = require('./../middleware/auth');

    router.post('/login', (req, res) => {
        UserController.auth(req.body.userData).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
    });

    router.post('/save', (req, res) => {
        UserController.save(req.body.userData).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
    });

    router.get('/all', auth, (req, res) => {
        UserController.load(req.body)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send(err);
            });
    });

    router.post('/logout', auth, (req, res) => {
        console.log(req.body.userData);
        UserController.removeToken(req.body.userData).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
    });

    router.get('/truncate', (req, res) => {
        UserController.clear().then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
    });

    app.use('/api/user', router);
};
