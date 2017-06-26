(function () {
    'use strict';

    angular
        .module('app.register')
        .factory('RegisterService', RegisterService)

    RegisterService.$inject = ['$http'];

    function RegisterService($http) {
        var service = {
            register: _register
        };

        return service;

        function _register(data) {
            return $http.post('/api/user/save', data);
        }
    }
})();