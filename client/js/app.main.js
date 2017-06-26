(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',

        'app.routes',
        'app.login',
        'app.register',
        'app.chat',

        'ngMaterial',
        'ngMdIcons',
    ]);

    angular.module('app.routes', []);
    angular.module('app.login', []);
    angular.module('app.register', []);
    angular.module('app.chat', []);
})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(mainConfig)

    mainConfig.$inject = ['$mdThemingProvider'];

    function mainConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('deep-orange');
    }

}());