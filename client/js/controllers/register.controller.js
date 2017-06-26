(function () {
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController)

    RegisterController.$inject = [
        'RegisterService',
        '$mdToast',
        '$location',
        '$document'
    ];

    function RegisterController(
        RegisterService,
        $mdToast,
        $location,
        $document
    ) {
        const vm = this;

        vm.register = () => {
            vm.dataLoading = true;
            RegisterService.register({
                'userData': angular.copy(vm.userData)}).then(
                function sucessCallback(response) {
                     if(response.data.success){
                         $mdToast.show($mdToast.simple().textContent('Account created successfully'));
                        $location.path('/home');
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
        }

        activate();

        function activate() {
            vm.dataLoading = false;
        }
    }
})();
