(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock)

    runBlock.$inject = ['$rootScope', '$location'];

    function runBlock($rootScope, $location) {
        $rootScope.$on('$locationChangeStart', () => {
            const restrictedPage = $location.path() == '/chat';
            const loggedIn = $rootScope.userSession;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
}());
