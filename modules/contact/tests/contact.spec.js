
describe('Module: app.contact', function(){

    beforeEach(module('main'));

    var views = [
        'modules/app/views/layout.html',
        'modules/contact/views/contact.html',
        'modules/contact/views/contact-list.html',
        'modules/contact/views/contact-detail.html',
        'modules/contact/views/contact-form.html'
    ];

    var 
        injector,
        $controller,
        $rootScope,
        $state,
        Contact;

    beforeEach(inject(function($injector){
        injector = $injector;
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        Contact = $injector.get('Contact');
        $state = $injector.get('$state');
        $httpBackend = $injector.get('$httpBackend');

        views.forEach(function(view){
            $httpBackend.when('GET', view).respond('');
        });

    }));

    describe('Controller: ContactListCtrl', function(){

        var ctrl, scope;

        beforeEach(inject(function($controller){

            scope = $rootScope.$new();
            
            $httpBackend.when('GET', '/contacts/').respond([{}, {}, {}]);

            ctrl = $controller('ContactListCtrl', {
                $scope: scope,
                '$state': $state,
                'Contact': Contact,
                'contacts': []
            });

            $httpBackend.flush();
        }))

        it('should refresh contacts', function(){
            $rootScope.$broadcast('contact:refresh');
            $httpBackend.flush();
            expect(ctrl.contacts.length).toEqual(3);
        })

        it('should call state contact.list', function(){
            spyOn($state, 'go');
            $state.go('contact.list');
            expect($state.go).toHaveBeenCalledWith('contact.list');
        })

        it('should have contacts', function(){
            successCallback = jasmine.createSpy('success');
            Contact.getList().then(successCallback);
            $httpBackend.flush();
            expect(successCallback).toHaveBeenCalledWith([{}, {}, {}]);
        })

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('Controller: ContactDetailCtrl', function(){

        var ctrl, scope;

        beforeEach(inject(function($controller){
            scope = $rootScope.$new();
            ctrl = $controller('ContactDetailCtrl', {
                $scope: scope,
                Contact: injector.get('Contact'),
                contact: {id: 1}
            })
        }));

        it('should be contact.id equals 1', function(){
            expect(ctrl.contact.id).toBe(1);
        });

    });

})