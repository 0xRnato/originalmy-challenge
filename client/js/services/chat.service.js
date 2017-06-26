(function () {
    'use strict';

    angular
        .module('app.chat')
        .factory('ChatService', ChatService)

    ChatService.$inject = ['$http', '$rootScope'];

    function ChatService($http, $rootScope) {
        var service = {
            logout: _logout
        };

        return service;

        function _logout(data) {
            return $http({
                method: 'POST',
                url: '/api/user/logout',
                headers: {
                    'x-access-token': $rootScope.userSession.token
                }, data: data
            });
        }
    }
})();