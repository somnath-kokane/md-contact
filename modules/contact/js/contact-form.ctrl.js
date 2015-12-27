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