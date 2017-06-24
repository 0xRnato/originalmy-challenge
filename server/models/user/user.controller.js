const jwt = require('jsonwebtoken');

/** Class representing a user */
class UserController {
    /**
     * Save User
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to save or create a new user on database
     */
    save(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.UserModel.findOneAndUpdate({
                _id: userData._id,
            }), userData, {upsert: true}, (err, doc) => {
                if (err) {
                    reject({
                        success: false,
                        message: err,
                    });
                } else {
                    resolve({
                        success: true,
                        message: doc,
                    });
                }
            };
        });
    }

    /**
     * Atuhenticate User
     * @param {Object} userData - An object that contains user data
     * @return {Promisse}
     * @description Used to authenticate a user
     */
    auth(userData) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.User.findOne({username: userData.username}, (err, user) => {
                if (err) throw err;
                // check that the user was found
                if (!user) {
                    reject({
                        success: false,
                        message: 'Authentication falied. User not found.',
                    });
                } else if (user) {
                    // check if password match
                    if (user.password != userData.password) {
                        reject({
                            success: false,
                            message: 'Authentication falied. Wrong password.',
                        });
                    } else {
                        // if user is found and password is right
                        // create a token
                        const token = jwt.sign(user, process.env.JWT_SECRET, {
                            expiresIn: 120,
                        });
                        self.save(user).then((response) => {
                            resolve({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                }
            });
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
        userData.token = undefined;
        return new Promise((resolve, reject) => {
            self.UserModel.findOneAndUpdate({
                _id: userData._id,
            }), userData, {upsert: false}, (err, doc) => {
                if (err) {
                    reject({
                        success: false,
                        message: err,
                    });
                } else {
                    resolve({
                        success: true,
                        message: doc,
                    });
                }
            };
        });
    }

    /**
     * Load all users
     * @return {Promisse}
     * @description Used to get a list with all user on database
     */
    load() {
        const self = this;
        return new Promise((resolve, reject) => {
            // FIXME: Is not connecting with the mongo
            self.UserModel.find({}), (err, doc) => {
                if (err) {
                    reject({
                        success: false,
                        message: err,
                    });
                } else {
                    resolve({
                        success: true,
                        message: doc,
                    });
                }
            };
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

module.exports = () => {
    const UserModel = require('./user.model');
    return new UserController(UserModel);
};
