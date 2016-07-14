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

Storage.prototype.delete = function(targetId) {

        var targetIndex;

        var targetItem = this.items.find(function(currentItem, currentIndex)    {

            var answer = (currentItem.id === targetId);

            if (answer) {
                targetIndex = currentIndex;
                return answer
            }
        })

        if (targetIndex !== undefined) this.items.splice(targetIndex, 1);

        return targetItem;
};

Storage.prototype.edit = function (targetId, targetName) {

        var targetIndex;

        var targetItem = this.items.find(function(currentItem, currentIndex)    {
            var answer = (currentItem.id == targetId);
            if (answer) {
                targetIndex = currentIndex;
                return answer
            }
        })

        if (targetIndex !== undefined) this.items[targetIndex].name = targetName;

        return targetItem;
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

        var id = +req.params.id;
        var item = storage.delete(id);

        if (item) {
            return res.status(201).json(item);
        } 
        else {
      return res.sendStatus(404).json("Item not found.");
        }
});

app.put('/items/:id', jsonParser, function(req, res) {
        var id = parseInt(req.body.id);
        var name = req.body.name;
        
        var item = storage.edit(id, name);
        
        if (item) {
            return res.status(200).json(item);  
        } 
        else {
            return res.sendStatus(404).json("Item not found.");
        }
   
});

app.listen(process.env.PORT || 8080);