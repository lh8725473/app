describe('App.Users', function() {
    beforeEach(module('App.Resources'));

    var users
    var httpBackend
    beforeEach(inject(function(Users, $httpBackend) {
        users = Users
        httpBackend = $httpBackend
    }))

    it('Hello', function() {
        user = users.query()
        httpBackend.flush()
    })
})