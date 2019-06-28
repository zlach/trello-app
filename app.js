const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

const LISTS = [];
const CARDS = [];

app.post('/cards', function(req, res){
    let dest = req.body.destination;
    for (let item of LISTS){
        if (item.guid == dest){
            item.cards.push(req.body);
        }
    }
    res.send('received');
})

app.post('/cards/edit', function(req, res){
    var list = req.body.list;
    var index = req.body.index;
    var text = req.body.text;
    for (let item of LISTS){
        if(item.guid == list){
            item.cards[index].text = text;
        }
    }
})

app.post('/cards/move', function(req, res){
    console.log('in');
    var index = req.body.index;
    var list_to = req.body.listTo;
    var list_from = req.body.listFrom;
    var card = req.body.card;
    var move = '';
    for (let l of LISTS){
        if (l.guid == list_from){
            for (let i = 0; i < l.cards.length;i++){
                if (l.cards[i].guid == card){
                    move = l.cards.splice(i, 1)[0];
                }
            }
        }
    }
    for (let li of LISTS){
        if (li.guid == list_to){
            li.cards.splice(index, 0, move);
        }
    }
    res.send('received');
})

app.post('/cards/moveall', function(req,res){
    var from = req.body.from;
    var to = req.body.to;
    for (let item of LISTS){
        if (item.guid == from){
            let moves = item.cards;
            item.cards = [];
            for (let thing of LISTS){
                if (thing.guid == to){
                    for (let move of moves){
                        thing.cards.push(move);
                    }
                }
            }
        }
    }
})

app.post('/cards/delete', function(req, res){
    var index = req.body.index;
    var list = req.body.list;
    for (let item of LISTS){
        if(item.guid == list){
            item.cards.splice(index, 1);
            console.log(item.cards);
        }
    }
    res.send('received');
})

app.post('/lists', function(req, res){
    if(!listExists(req.body.guid)){
        let list = req.body;
        list['cards'] = [];
        LISTS.push(list);
    }
    res.send('received');
})

app.post('/lists/delete', function(req, res){
    LISTS.splice(req.body.index, 1);
})

app.post('/lists/move', function(req, res){
    let selected = req.body.selected;
    let index = req.body.index;
    for (let i = 0; i < LISTS.length;i++){
        if (i == index){
            let move = LISTS.splice(i, 1)[0];
            LISTS.splice(selected, 0, move);
        }
    }
    res.send('received');
})

app.get('/lists', function(req, res){
    res.send(LISTS);
})

function listExists(guid){
    for (let item of LISTS){
        if (item.guid === guid){
            return true;
        }
    }
    return false;
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
