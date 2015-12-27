(function(){

    angular
        .module('app.contact')
        .controller('ContactListCtrl', ContactListCtrl);

    ContactListCtrl.$inject = ['$scope', '$state', 'Contact', 'contacts'];

    function ContactListCtrl($scope, $state, Contact, contacts){
        var vm = this;

        activate();

        function activate(){
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
            return Contact.getList({q: q}).then(function(data){
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