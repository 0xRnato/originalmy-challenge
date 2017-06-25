module.exports = (db) => {
    const UserModel = db.define('tbl_user', {
        id: {type: 'serial', key: true},
        username: String,
        password: String,
        token: String,
    });
    return UserModel;
};
