var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
        var itemID = +req.params.id;
            if (typeof itemID === 'number') {
  
        var deletedItem;
   
        storage.items.forEach(function(object, index, storageArray){
            if (object.id === itemID) {
                deletedItem = object;
                return storageArray.splice(index, 1);
            } 
        });
        res.status(202).json(deletedItem); // Accepted
        
    } else {
        var responseMsg = {'message': 'No item with that id was found'};
        res.status(404).json(responseMsg); // Not Found
    }
});
    

app.listen(process.env.PORT || 8080);