(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController)

    LoginController.$inject = [
        'LoginService',
        '$mdToast',
        '$location',
        '$rootScope',
        '$document'
    ];

    function LoginController(
        LoginService,
        $mdToast,
        $location,
        $rootScope,
        $document
    ) {
        const vm = this;

        vm.login = () => {
            vm.dataLoading = true;
            LoginService.login({
                'userData': angular.copy(vm.userData)
            }).then(
                function sucessCallback(response) {
                    if (response.data.success) {
                        const userSession = {
                            username: vm.userData.username,
                            token: response.data.token
                        }
                        vm.userSession = userSession;
                        $rootScope.userSession = angular.copy(vm.userSession);
                        $mdToast.show($mdToast.simple().textContent('Welcome ' + userSession.username));
                        $rootScope.socket = io();
                        $rootScope.socket.emit('login', userSession.username);
                        $location.path('/chat');
                    } else {
                        $mdToast.show($mdToast.simple().textContent(response.data.err));
                        vm.userData = {};
                        const input = $document[0].getElementById('usernameForm');
                        input.focus();
                        vm.dataLoading = false;
                    }
                }, function errorCallback(response) {
                    $mdToast.show($mdToast.simple()
                        .textContent('Status error: ' + response.status + ' - ' + response.statusText)
                    );
                    vm.user = {};
                    const input = $document[0].getElementById('usernameForm');
                    input.focus();
                    vm.dataLoading = false;
                }
                );
        };

        vm.register = () => {
            $location.path('/register');
        }

        activate();

        function activate() {
            vm.dataLoading = false;
        }
    }
})();
