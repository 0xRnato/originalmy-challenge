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
        '$document',
        "$scope",
        '$anchorScroll'
    ];

    function ChatController(
        ChatService,
        $mdToast,
        $location,
        $rootScope,
        $document,
        $scope,
        $anchorScroll
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
                        $rootScope.socket.disconnect();
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

        vm.sendMsg = () => {
            if (vm.message) {
                const msg = {
                    from: $rootScope.userSession.username,
                    message: vm.message
                }
                $rootScope.socket.emit('msg', msg);
                vm.messages.push(msg);
                vm.message = '';
                $scope.$digest();
            }
        }

        $rootScope.socket.on('welcome', (_username) => {
            $mdToast.show($mdToast.simple().textContent(_username + ' has connected to the chat.'));
        });

        $rootScope.socket.on('left', (_username) => {
            $mdToast.show($mdToast.simple().textContent(_username + ' has disconnected from the chat.'));
        });

        $rootScope.socket.on('msg', (_message) => {
            vm.messages.push(_message);
            $scope.$digest();
        });

        activate();

        function activate() {
            vm.messages = [];
        }
    }
})();