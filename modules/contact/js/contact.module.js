(function(){

    angular.module('app.contact', []);

    angular
        .module('app.contact')
        .config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider){
        $stateProvider
            .state('contact', {
                parent: 'app',
                url: '/contact',
                templateUrl: 'modules/contact/views/contact.html',
                controller: 'ContactCtrl',
                controllerAs: 'vm'
            })
            .state('contact.list', {
                url: '/list',
                templateUrl: 'modules/contact/views/contact-list.html',
                controller: 'ContactListCtrl',
                controllerAs: 'vm',
                resolve: {
                    contacts: ['Contact', function(Contact){
                        return Contact.getList().then(null, function(err){
                            console.log('err', err);
                        });
                    }]
                }
            })
            .state('contact.detail', {
                parent: 'contact.list',
                url: '/detail/:id',
                templateUrl: 'modules/contact/views/contact-detail.html',
                controller: 'ContactDetailCtrl',
                controllerAs: 'vm',
                resolve: {
                    contact: ['Contact', '$stateParams', 
                    function(Contact, $stateParams){
                        return Contact.getById($stateParams.id);
                    }]
                }
            })
            .state('contact.form', {
                parent: 'contact.detail',
                url:'/form/:id',
                templateUrl: 'modules/contact/views/contact-form.html',
                controller: 'ContactFormCtrl',
                controllerAs: 'vm',
                resolve: {
                    contact: ['Contact', '$stateParams', 
                    function(Contact, $stateParams){
                        return Contact.getById($stateParams.id);
                    }]
                }
            });
    }

})();


