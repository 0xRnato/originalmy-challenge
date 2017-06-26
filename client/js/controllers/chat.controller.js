(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController)

    ChatController.$inject = [
        'ChatService',
        '$mdToast',
        '$location',
        '$rootScope',
        '$document'
    ];

    function ChatController(
        ChatService,
        $mdToast,
        $location,
        $rootScope,
        $document
    ) {
        var vm = this;

        vm.logout = () => {
            vm.dataLoading = true;
            ChatService.logout({
                'userData': {
                    'username': angular.copy($rootScope.userSession.username)
                }
            }).then(
                function sucessCallback(response) {
                    if (response.data.success) {
                        delete $rootScope.userSession;
                        $mdToast.show($mdToast.simple().textContent('Bye'));
                        $location.path('/login');
                    } else {
                        $mdToast.show($mdToast.simple().textContent(response.data.err));
                        vm.dataLoading = false;
                    }
                },
                function errorCallback(response) {
                    $mdToast.show($mdToast.simple()
                        .textContent('Status error: ' + response.status + ' - ' + response.statusText)
                    );
                    vm.dataLoading = false;
                }
            );
        }

        activate();

        function activate() { }
    }
})();