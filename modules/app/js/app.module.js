(function(){

    angular.module('app', []);

    angular
        .module('app')
        .config(configure);

    configure.$inject = ['$stateProvider', '$mdThemingProvider', '$urlRouterProvider'];

    function configure($stateProvider, $mdThemingProvider, $urlRouterProvider){

        $mdThemingProvider.theme('default')
            .primaryPalette('deep-purple');

        $stateProvider.state('app', {
            url: '',
            templateUrl: 'modules/app/views/layout.html'
        })
        .state('home', {
            parent:'app',
            template: '<p>Home</p>'
        });

        $urlRouterProvider.otherwise('/contact');
    }

})();
