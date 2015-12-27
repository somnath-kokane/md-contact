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