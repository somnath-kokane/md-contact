'use strict';
(function(){

    angular.module('app', []);

    angular.module('main', ['ui.router', 'ngMaterial', 'ngMessages', 'ngMdIcons',
            'app', 'app.contact']);

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



(function(){

    angular
        .module('app.contact')
        .controller('ContactDetailCtrl', ContactDetailCtrl);

    ContactDetailCtrl.$inject = ['$scope', 'Contact', 'contact']

    function ContactDetailCtrl($scope, Contact, contact){
        var vm = this, parent;

        activate();

        function activate(){
            vm.contact = angular.copy(contact);
            vm.onDelete = onDelete;
            vm.onEdit = onEdit;
            $scope.$on('contact:refresh', onRefresh);
        }

        function onRefresh(){
            Contact.getById(vm.contact.id).then(function(data){
                vm.contact = data;
            })
        }

        function onEdit(ev){
            var contact = angular.copy(vm.contact);
            $scope.$emit('contact:edit', function(callback){
                callback(ev, contact);
            });
        }

        function onDelete(ev){
            var contact = angular.copy(vm.contact);
            $scope.$emit('contact:delete', function(callback){
                callback(ev, contact);
            });
        }

    }

})();
(function(){

    angular
        .module('app.contact')
        .controller('ContactFormCtrl', ContactFormCtrl);

    ContactFormCtrl.$inject = ['$scope', 'Contact'];

    function ContactFormCtrl($scope, Contact){
        var vm = this, parent;

        activate();

        function activate(){
            vm.onSave = onSave;
        }

        function onSave(){
            var contact = angular.copy(vm.contact);
            $scope.cancel && $scope.cancel();
            $scope.$emit('contact:save', function(callback){
                callback(contact)
            });
        }
    }

})();
(function(){

    angular
        .module('app.contact')
        .controller('ContactListCtrl', ContactListCtrl);

    ContactListCtrl.$inject = ['$scope', '$state', 'Contact', 'contacts'];

    function ContactListCtrl($scope, $state, Contact, contacts){
        var vm = this;

        activate();

        function activate(){
            vm.version = '1.0.0';
            vm.contacts = angular.copy(contacts);
            vm.onSelect = onSelect;
            $scope.$on('contact:refresh', onRefresh);
            $scope.$on('contact:search', onSearch);

            $scope.$evalAsync(function(){
                if($state.current.name == 'contact.list'){
                    onSelect(vm.contacts[0]);
                }
            })
        }

        function onRefresh(){
            Contact.getList().then(function(data){
                vm.contacts = data;
            })
        }

        function onSearch(event, q){
            Contact.getList({q: q}).then(function(data){
                vm.contacts = data;
                onSelect(vm.contacts[0]);
            })
        }

        function onSelect(contact){
            var name = contact ? 'contact.detail' : 'contact.list';
            var params = contact ? {id: contact.id} : null;
            $state.go(name, params);
        }
    }

})();
(function(){

    angular
        .module('app.contact')
        .controller('ContactCtrl', ContactCtrl);

    ContactCtrl.$inject = ['$scope', '$state', '$mdDialog', '$mdMedia', 'Contact'];

    function ContactCtrl($scope, $state, $mdDialog, $mdMedia, Contact){
        var vm = this;

        activate();

        function activate(){
            vm.onAdd = onAdd;
            vm.onSearch = onSearch;
            $scope.$on('contact:select', wrap(onSelect));
            $scope.$on('contact:delete', wrap(onDelete));
            $scope.$on('contact:edit', wrap(onEdit));
            $scope.$on('contact:save', wrap(onSave));

            $scope.$evalAsync(function(){
                if($state.current.name == 'contact'){
                    $state.go('contact.list');
                }
            })
        }

        function wrap(callback){
            return function(event, fn){
                return fn(callback);
            };
        }

        function onSelected(){
            return vm.contact;
        }

        function onSelect(contact){
            $scope.$broadcast('contact:selected', contact);
        }

        function onSearch(q){
            $scope.$broadcast('contact:search', q);
        }

        function onAdd(ev ){
            showFormDialog(ev, {});
        }

        function onEdit(ev, contact){
            showFormDialog(ev, contact);
        }

        function onDelete(ev, contact){
            showDeleteDialog(ev, contact); 
        }

        function onSave(contact){
            saveContact(contact);
        }

        function showFormDialog(ev, contact){
            console.log('contact', contact);
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            
            $mdDialog.show({
                controller: 'ContactFormCtrl',
                controllerAs: 'vm',
                bindToController: true,
                locals: {
                    contact: contact
                },
                scope: $scope.$new(),
                templateUrl: 'modules/contact/views/contact-form.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                fullscreen: useFullScreen,
                onComplete: function(scope){
                    scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            })
        }

        function showDeleteDialog(ev, contact){
            var confirm = $mdDialog
                .confirm()
                .title('Confirm - Delete')
                .textContent('Would you like to delete contact of '+ contact.name + '?')
                .ariaLabel('Confirm-Delete')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function(){
                deleteContact(contact);
            }).finally(function(){
                confirm = undefined;
            })
        }

        function deleteContact(contact){
            Contact.remove(contact.id).then(function(){
                $scope.$broadcast('contact:refresh');
                $state.go('contact.list');
            })
        }

        function saveContact(contact){
            Contact.save(contact).then(function(data){
                console.log('save.data', data);
                $scope.$broadcast('contact:refresh');
                $state.go('contact.detail', {id: data.id})
            });
        }
    }

})();
(function(){

    angular
        .module('app.contact')
        .factory('Contact', Contact);

    Contact.$inject = ['$http', '$q'];

    function Contact($http, $q){

        var Contact;
        
        Contact = {
            getList: getList,
            getById: getById,
            remove: remove,
            save: save
        };

        return Contact;

        function getList(params){
            var url = '/contacts/';
            return $http
                .get(url, {params: params})
                .then(function(resp){
                    return resp.data;
                })
        }

        function getById(id){
            var url = '/contacts/'+id;
            return $http
                .get(url)
                .then(function(resp){
                    return resp.data;
                })
        }

        function remove(id){
            var url = '/contacts/'+id;
            return $http
                .delete(url)
                .then(function(resp){
                    return resp.data;
                })
        }

        function save(contact){
            if(contact.id){
                return update(contact, contact.id);
            }
            return create(contact);
        }

        function update(contact, id){
            var url = '/contacts/'+id;
            return $http
                .put(url, contact)
                .then(function(resp){
                    return resp.data;
                });
        }

        function create(contact){
            var url = '/contacts/';
            return $http
                .post(url, contact)
                .then(function(resp){
                    return resp.data;
                })
        }
    }


})();