const jwt = require('jsonwebtoken');

/** Class representing a user */
class UserController {
    /**
     * Save UserModel
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to save or create a new user on database
     */
    save(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (userData.username && userData.password) {
                if (userData.id) {
                    self.UserModel.get(userData.id, (err, data) => {
                        // update data of object on db
                        for (let i in data) {
                            if (data.hasOwnProperty(i)) {
                                data[i] = userData[i];
                            }
                        }
                        // saving changes
                        data.save((err) => {
                            if (err) {
                                reject({
                                    success: false,
                                    err: err,
                                });
                            } else {
                                resolve({
                                    success: true,
                                    data: data,
                                });
                            }
                        });
                    });
                } else {
                    // create a new object in db and save
                    self.UserModel.create(userData, (err, data) => {
                        if (err) {
                            reject({
                                success: false,
                                err: err,
                            });
                        } else {
                            resolve({
                                success: true,
                                data: data,
                            });
                        }
                    });
                }
            } else {
                if (!userData.username) {
                    reject({
                        success: false,
                        err: 'Username can not be void or null.',
                    });
                } else if (!userData.password) {
                    reject({
                        success: false,
                        err: 'Password can not be void or null.',
                    });
                }
            }
        });
    }

    /**
     * Atuhenticate UserModel
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to authenticate a user
     */
    auth(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (userData.username && userData.password) {
                self.UserModel.find({
                    username: userData.username,
                }, (err, userList) => {
                    if (err) {
                        reject({
                            success: false,
                            err: err.err,
                        });
                    }
                    if (userList.length === 0) {
                        reject({
                            success: false,
                            err: 'Authentication falied. User not found.',
                        });
                    } else {
                        if (userList[0].password != userData.password) {
                            reject({
                                success: false,
                                err: 'Authentication falied. Wrong password.',
                            });
                        } else {
                            // if user is found and password is right
                            // create a token
                            userList[0].token = null;
                            const token = jwt.sign(
                                userList[0], process.env.JWT_SECRET, {
                                expiresIn: process.env.TIMEOUT,
                            });
                            userList[0].token = token;
                            self.save(userList[0]).then((response) => {
                                resolve({
                                    success: true,
                                    token: token,
                                });
                            }).catch((err) => {
                                reject({
                                    success: false,
                                    err: err.err,
                                });
                            });
                        }
                    }
                });
            } else {
                if (!userData.username) {
                    reject({
                        success: false,
                        err: 'Username can not be void or null.',
                    });
                } else if (!userData.password) {
                    reject({
                        success: false,
                        err: 'Password can not be void or null.',
                    });
                }
            }
        });
    }

    /**
     * Remove Token
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to delete a user's token
     */
    removeToken(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (userData.username) {
                self.load(userData)
                    .then((data) => {
                        if (data.data[0]) {
                            let user = data.data[0];
                            user.token = undefined;
                            user.save((err) => {
                                if (err) {
                                    reject({
                                        success: false,
                                        err: err,
                                    });
                                } else {
                                    resolve({
                                        success: true,
                                        data: user,
                                    });
                                }
                            });
                        } else {
                            reject({
                                success: false,
                                err: 'Logout falied, User not Found.',
                            });
                        }
                    }).catch((err) => {
                        reject({
                            success: false,
                            err: err,
                        });
                    });
            } else {
                if (!userData.username) {
                    reject({
                        success: false,
                        err: 'Username can not be void or null.',
                    });
                }
            }
        });
    }

    /**
     * Load all users
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to get a list with all users or a unic user on database
     */
    load(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (userData) {
                self.UserModel.find(userData, (err, data) => {
                    if (err) {
                        reject({
                            success: false,
                            err: err.err,
                        });
                    } else {
                        resolve({
                            success: true,
                            data: data,
                        });
                    }
                });
            } else {
                self.UserModel.find({}, (err, data) => {
                    if (err) {
                        reject({
                            success: false,
                            err: err.err,
                        });
                    } else {
                        resolve({
                            success: true,
                            data: data,
                        });
                    }
                });
            }
        });
    }

    /**
     * Delete users
     * @return {Promisse}
     * @description Used to truncate users table
     */
    clear() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.UserModel.clear((err) => {
                if (err) {
                        reject({
                            success: false,
                            err: err.err,
                        });
                    } else {
                        resolve({
                            success: true,
                            data: 'Table truncated successfully',
                        });
                    }
            });
        });
    }

    /**
     * @constructor
     * @param {Schema} UserModel
     */
    constructor(UserModel) {
        this.UserModel = UserModel;
    }
}

module.exports = (db) => {
    const UserModel = require('./user.model')(db);
    return new UserController(UserModel);
};
