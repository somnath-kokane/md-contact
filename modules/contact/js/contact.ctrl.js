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