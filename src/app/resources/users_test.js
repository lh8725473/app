describe('App.Users', function() {
    var userlistResponse = {
        "statusCode": 200,
        "costTime": 0.14460802078247,
        "msg": "ok",
        "result": [{
            "user_id": "1",
            "user_name": "admin",
            "real_name": "\u7ba1\u7406\u5458",
            "email": "ljzxzxl@gmail.com",
            "phone": "13598765432",
            "total_space": "10",
            "group_id": "2",
            "role_id": "1",
            "cloud_id": "3"
        }, {
            "user_id": "3",
            "user_name": "test2",
            "real_name": "\u6d4b\u8bd5\u7528\u6237",
            "email": "test2@gmail.com",
            "phone": "13598765432",
            "total_space": "1",
            "group_id": "2",
            "cloud_id": "3"
        }, {
            "user_id": "14",
            "user_name": "Terro.Tie",
            "real_name": "\u94c1\u91d1\u9f99",
            "email": "tiemuxu@gmail.com",
            "total_space": "10",
            "role_id": "1",
            "cloud_id": "3"
        }, {
            "user_id": "12",
            "user_name": "Eric.Fan",
            "real_name": "eric.fan",
            "email": "eric.fan@gmail.com",
            "total_space": "10",
            "role_id": "1",
            "cloud_id": "3"
        }, {
            "user_id": "15",
            "user_name": "Yi.Yi",
            "real_name": "\u80e1\u660e",
            "email": "yiyi@gmail.com",
            "total_space": "10",
            "role_id": "1",
            "cloud_id": "3"
        }, {
            "user_id": "16",
            "user_name": "lh8725473",
            "real_name": "\u5218\u6d69",
            "email": "lh8725473@gmail.com",
            "total_space": "10",
            "cloud_id": "3"
        }, {
            "user_id": "17",
            "user_name": "wasdw159",
            "real_name": "\u5f20\u6d9b",
            "email": "wasdw159@gmail.com",
            "total_space": "10",
            "cloud_id": "3"
        }]
    }
    beforeEach(module('App.Resources'))

    var users
    var httpBackend
    beforeEach(inject(function(Users, $httpBackend) {
        users = Users
        httpBackend = $httpBackend
    }))

    it('Hello User', function() {
        httpBackend.whenGET('/users').respond(userlistResponse.result)
        user = users.query()
        httpBackend.flush()
        expect(JSON.stringify(user)).toEqual(JSON.stringify(userlistResponse.result))
    })
})