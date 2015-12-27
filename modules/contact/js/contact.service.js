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