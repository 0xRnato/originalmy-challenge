(function () {
    'use strict';

    angular
        .module('app.login')
        .factory('LoginService', LoginService)

    LoginService.$inject = ['$http'];

    function LoginService($http) {
        var service = {
            login: _login
        };

        return service;

        function _login(data) {
            return $http.post('/api/user/login', data);
        }
    }
})();