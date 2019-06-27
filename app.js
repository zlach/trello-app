const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

const LISTS = [];
const CARDS = [];

app.post('/lists', function(req, res){
    if(!listExists(req.body.guid)){
        LISTS.push(req.body);
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
