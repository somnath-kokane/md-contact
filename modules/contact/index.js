
var fs = require('fs');
var _ = require('lodash');

module.exports = function(){
    var contacts = [];
    var cache = {contacts: {}};
    var router = require('express').Router();
    router.get('/', getList);
    router.get('/:id', getById);
    router.post('/', create);
    router.put('/:id', update);
    router.delete('/:id', remove);

    contacts = JSON.parse(fs.readFileSync(__dirname + '/data/contacts.json').toString());

    contacts.forEach(function(item){
        cache.contacts[''+item.id] = item;
    })

    return router;

    function getList(req, res){
        var data = [];
        var q = req.query.q;
        Object.keys(cache.contacts).reverse().forEach(function(key){
            var item = cache.contacts[key];
            if(!!q){
                var name = item.name;
                var regex = new RegExp(q, 'gi');
                if(regex.test(name)){
                    data.push(item);
                }
            } else {
                data.push(item);
            }
        });
        res.json(data);
    }

    function getById(req, res){
        var id = req.params.id;
        res.json(cache.contacts[id]);
    }

    function create(req, res){
        var data = req.body;
        data.id = contacts.length + 1;
        cache.contacts[''+data.id] = data;
        res.json({
            id: data.id
        });
    }

    function update(req, res){
        var data = req.body;
        var id = req.params.id;
        _.extend(cache.contacts[id], data);
        res.json({success: true});
    }

    function remove(req, res){
        var id = req.params.id;
        delete cache.contacts[id];
        res.json({success: true});
    }

};


