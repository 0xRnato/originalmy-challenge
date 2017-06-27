module.exports = (io, users) => {
    let _username;
    let _sessionId;
    io.on('connection', (socket) => {
        socket.on('login', (username) => {
            _username = username;
            _sessionId = socket.id;
            users.push({sessionId: _sessionId, username: _username});
            socket.broadcast.emit('welcome', username);
        });

        socket.on('disconnect', () => {
            const _user = users.find((user) => {
                return socket.id === user.sessionId;
            });

            if (_user) {
                socket.broadcast.emit('left', _user.username);
            } else {
                socket.broadcast.emit('left', 'Someone');
            }
        });

        socket.on('msg', (msg) => {
            socket.broadcast.emit('msg', msg);
        });
    });
};
