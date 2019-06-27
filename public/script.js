function Guid(){
    let rnd = function() { return Math.random().toString(36).substr(2, 32);}
    let guid = rnd() + "-" + rnd() + "-" +rnd() + "-" + rnd();
    this.guid = guid;
}

function disappear(item){
    item.style.display = "none";
    appear();
}

function appear(){
    var element = document.querySelector('.swim-lane-namer');
    // var clickout = document.querySelector('#clickout-guy')
    // clickout.style.display = "block";
    element.style.display = "inline-block";
    var element_input = document.getElementById('list-title');
    element_input.focus();
}

/*--- Code below forms a new list when you create a 
name and hit the green button, "Add List" --*/
function addList(){
    var byebye = document.getElementById('list-dropdown');
    byebye.style.display = "none";
    var list_name = document.querySelector('.list-title').value;
    if (list_name == ''){
        return;
    } else {
        createEmptyList(list_name);
        document.querySelector('.list-title').value = '';
        document.querySelector('.list-title').focus();
        // replacePlaceholder();
    }
}

let list_array = [];

let card_array = [];



function replacePlaceholder(){
    
    var namer = document.querySelector(".swim-lane-namer");
    namer.style.display = "none";
    var placeholder = document.querySelector('.swim-lane-placeholder');
    placeholder.style.display = "inline-block";
    // placeholder.innerHTML = "<i class='fas fa-plus'></i> &nbspAdd another list";

    // var clickout = document.querySelector('#clickout-guy');
    // clickout.style.display = 'none';
}

let list_number = 1;
function createEmptyList(list_name, guid){
    // create empty list to hold it all//
    var new_list = document.createElement('div');
    new_list.setAttribute('id', 'list' + list_number);
    new_list.setAttribute('class', 'list');
    // top of list needs own div so it can flex//
    var new_list_top = document.createElement('div');
    new_list_top.setAttribute('id', 'list-top' + list_number);
    new_list_top.setAttribute('class', 'list-top');
    // the title will go in a span that can be edited//
    var new_list_span = document.createElement('span');
    new_list_span.setAttribute('id', 'list-span' + list_number);
    new_list_span.setAttribute('class', 'list-span');
    new_list_span.setAttribute('contenteditable', 'true');
    // // button to add functionality later//
    var new_list_button = document.createElement('button');
    new_list_button.setAttribute('id', 'list-button' + list_number);
    new_list_button.setAttribute('class', 'list-button');
    new_list_button.setAttribute('onclick', 'listDropdown(this)'); //function
    // add the list name via inherited variable//
    new_list_span.innerHTML = list_name;
    // add the button image (ellipsis)//
    new_list_button.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    // //stick the button in the div for dropdown purposes//
    // var dropdown_container = document.createElement('div');
    // dropdown_container.setAttribute('id', 'dropdown-container' + list_number);
    // dropdown_container.setAttribute('class', 'dropdown-container');
    // dropdown_container.innerHTML = `<button id="list-button${list_number}" class="list-button" onclick="someShit('dropdown-container${list_number}')"><i class="fas fa-ellipsis-h"></i></button><div><a href='#'>Move List</a><a href='#'>Delete List</a></div>`;



    // put the span (list name) and button in that top flex part//
    new_list_top.appendChild(new_list_span);
    new_list_top.appendChild(new_list_button);
    // add the top part to the list//
    new_list.appendChild(new_list_top);
    //add empty middle section to add cards to later//
    var new_cards = document.createElement('div');
    // var clickout_guy = document.createElement('div');
    // clickout_guy.setAttribute('id', 'clickout-guy');
    new_cards.setAttribute('id', 'new-cards' + list_number);
    new_cards.setAttribute('class', 'new-cards');
    //need a first insert for hover effects on drag n drop
    var insert = document.createElement('div');
    insert.setAttribute('class', 'insert-top insert');
    insert.setAttribute('id', 'insert' + list_number);
    new_cards.append(insert);
    // new_cards.append(clickout_guy);
    new_list.appendChild(new_cards);
    // add a bottom button that will activate new card//
    var new_list_add = document.createElement('button');
    new_list_add.setAttribute('id', 'card-add' + list_number);
    new_list_add.setAttribute('class', 'card-add');
    new_list_add.setAttribute('onclick', `nameCard("${new_cards.id}")`); //function//
    new_list_add.innerHTML = '<i class="fas fa-plus"></i> &nbsp<span>Add a card</span>';
    //tie it all together and push it on out//
    new_list.appendChild(new_list_add);
    var new_lists = document.querySelector("#new-lists");
    new_lists.appendChild(new_list);
    if (guid){
        new_list.setAttribute('data-guid', guid);
        list_array.push(new_list);
    } else {
        let pre_guid = new Guid();
        let newguid = pre_guid.guid;
        new_list.setAttribute('data-guid', newguid);
        list_array.push(new_list);
        $.post('/lists', {"text": `${list_name}`, "destination": `${list_number}`, "guid":`${newguid}`}, null)
    }
    list_number += 1;
}



let card_number = 1;
function nameCard(id){
    var new_card = document.createElement('button');
    new_card.setAttribute('id', 'new-card' + card_number);
    new_card.setAttribute('class', 'new-card');
    new_card.setAttribute('draggable', 'true');
    // new_card.setAttribute('ondragstart', 'dragStart(event)');
    new_card.style.display = "none";
    var new_card_namer = document.createElement('textarea');
    new_card_namer.setAttribute('id', 'card-namer' + card_number);
    new_card_namer.setAttribute('class', 'card-namer');
    new_card_namer.setAttribute('placeholder', 'Enter a title for this card...');
    new_card_namer.setAttribute('onblur', `cardBlur("${new_card.id}", "${new_card_namer.id}", "${id}")`); //function - maybe go back and change this functionality//
    new_card_namer.setAttribute('onkeypress', `detectKey(event, "${new_card.id}", "${new_card_namer.id}", "${id}")`);//function
    var list_destination = document.getElementById(id);
    list_destination.style.padding = "0px 8px";
    var container_div = document.createElement('div');
    container_div.setAttribute('class', 'card-container');
    container_div.setAttribute('id', 'card-container' + card_number);
    container_div.appendChild(new_card_namer);
    container_div.appendChild(new_card);
    list_destination.appendChild(container_div);
    new_card_namer.focus();
    new_card_namer.value = '';
    card_number += 1;

    addDragStartEvent(new_card)
}


function addDragStartEvent(element) {
    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend', dragEnd);
} 


function cardBlur(card, namer, id) {
    var named = document.getElementById(namer);
    var name = named.value;
    var cardiB = document.getElementById(card);
    var edit_card = document.getElementById('is-edited-proxy');
    if (name == '' && edit_card.innerHTML == 'false'){
        named.style.display = 'none';
    } else if (name == '' && edit_card.innerHTML == 'true'){
        named.style.display = 'none';
        cardiB.style.display = 'flex';
        cardiB.nextElementSibling.style.display = "block";

        named.value = cardiB.firstChild.innerHTML;
    } else if (edit_card.innerHTML == 'true'){
        var clickout = document.getElementById('clickout-guy');
        clickout.style.display = 'none';
        editCardFinal(card, namer, id);
    } else {
        var clickout = document.getElementById('clickout-guy');
        clickout.style.display = 'none';
        addCard(card, namer, id);
    }
    var edit_card = document.getElementById('is-edited-proxy');
    edit_card.innerHTML = 'false';
    deleteGuyByeBye();
    resetCards();
}


function detectKey(event, card, namer, id){
    if(event.keyCode == 13){
        event.preventDefault();
        deleteGuyByeBye();
        var edit_card = document.getElementById('is-edited-proxy');
        var named = document.getElementById(namer);
        var cardiB = document.getElementById(card);
        if (named.value == '' && edit_card.innerHTML == 'false'){
            return;
        } else if (named.value == '' && edit_card.innerHTML == 'true'){
            named.style.display = 'none';
            cardiB.style.display = 'flex';
            cardiB.nextElementSibling.style.display = "block";
            named.value = cardiB.firstChild.innerHTML;
        } else {
    
            var clickout = document.getElementById('clickout-guy');
            clickout.style.display = 'none';
            // var name = document.getElementById(namer);
            var edit_card = document.getElementById('is-edited-proxy');

            if (edit_card.innerHTML == 'true') {
                var clickout = document.getElementById('clickout-guy');
                clickout.style.display = 'none';
                editCardFinal(card, namer, id);
            } else {
                // named.blur(); //blur instead of addCard to prevent calling addCard twice (once on blur and once on this)
                nameCard(id);
            }
        }
    } else {
        return;
    }    
}

function enterDirect(evt){
    if(evt.keyCode == 13){
        addList();
    } else {
        return;
    }
}

function editCardFinal(card, namer, id) {
    var clickout = document.getElementById('clickout-guy');
    clickout.style.display = 'none';
    var namer = document.getElementById(namer);
    namer.style.display = 'none';

    var spanny = document.getElementById(card).children[0];

    spanny.innerHTML = namer.value;
    var card = document.getElementById(card);
    card.style.display = 'flex';
    var card_insert = card.nextElementSibling;
    card_insert.style.display = "block";
}

function addCard(card, namer, id){
    var list_destination = document.getElementById(id);
    list_destination.style.padding = "0px 8px";
    var named = document.getElementById(namer);
    var name = named.value;
    named.style.display = "none";
    var spanny = document.createElement('span');
    spanny.innerHTML = name;
    var butt = document.createElement('button');
    butt.setAttribute('onclick', `editCard("${card}", "${namer}");`);
    butt.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    // butt.style.display = "none";
    var card = document.getElementById(card);
    card.innerHTML = '';
    card.style.display = "flex";
    card.append(spanny);
    card.append(butt);
    card.style.justifyContent = 'space-between';

    var insert = document.createElement('div');
    insert.setAttribute('class', 'insert');
    card.insertAdjacentElement('afterend', insert);


    // var index = namer[namer.length - 1];
    // var container_id = "card-container" + index;
    // var container = document.getElementById(container_id);
    
    card_array.push(card);
    // console.log(card_array);
}

function editCard(card, namer){

    var edit_card = document.getElementById('is-edited-proxy');
    edit_card.innerHTML = 'true';

    var card_guy = document.getElementById(card);

    // card_guy.innerHTML = '';

    // card_guy.parentNode.removeChild(card_guy);
    var card_guy_insert = card_guy.nextElementSibling;
    card_guy_insert.style.display = "none";
    card_guy.style.display = "none";

    var namer_guy = document.getElementById(namer);
    namer_guy.style.display = 'initial';
    namer_guy.style.position = 'relative';
    namer_guy.style.zIndex = '51';
    namer_guy.focus();
    var clickout_guy = document.getElementById('clickout-guy');
    clickout_guy.style.display = 'block';
    clickout_guy.style.zIndex = '10';

    deleteGuy(namer);
}

function deleteGuy(namer){
    var name = document.getElementById(namer);
    var scrolled = name.parentElement.parentElement;
    var scroll_top = scrolled.scrollTop;
    var scrolled_horizontal = document.getElementById('list-group');
    var scroll_left = scrolled_horizontal.scrollLeft;

    var delete_guy = document.getElementById('delete-guy');

    delete_guy.style.display = "block";
    delete_guy.style.left = (name.offsetLeft - scroll_left) + 251 + 'px';
    delete_guy.style.top = (name.offsetTop - scroll_top) + 'px';
    delete_guy.addEventListener('mousedown', function(){deleteCard(namer);}, false);
    // console.dir(delete_guy.getAttribute('onclick'));

    // delete_guy.addEventListener('click', (event) => {
    //     // delete this element card

    //     // remove this event listener

    //     console.log('start')

    //     delete_guy.removeEventListener('click')

    //     console.log('end')
    // })
    if ((name.offsetLeft - scroll_left) + 348 > window.innerWidth) {
        console.log('in?');
        delete_guy.style.left = (name.offsetLeft - scroll_left) - 98 + 'px';
    }//sketchy
}

function deleteCard(namer){
    // var namer = document.getElementById(namer);
    console.log(namer);
    var index = namer.substr(10);
    console.log(index);
    var bye_guy_id = 'card-container' + index;
    var bye_guy = document.getElementById(bye_guy_id);
    bye_guy.style.display = 'none';
    var target = 'new-card' + index;
    for (let i = 0;i < card_array.length;i++){
        if (card_array[i].id == target){
            card_array.splice(i, 1);
        }
    }
    deleteGuyByeBye();
    reprintLists();
}


// function showAddCardButton(id){
//     var bottom = document.getElementById('card-add' + id[id.length - 1]);
//     bottom.style.display = "none";
//     var new_bottom = document.createElement('div');
//     new_bottom.innerHTML = "<input type='button' value='fooku'/>";
//     var target = document.getElementById('list' + id[id.length - 1]);
//     target.insertAdjacentHTML('beforeend', new_bottom);
// }


// let swim_lane_namer = document.querySelector(".swim-lane-namer");

// swim_lane_namer.addEventListener("focusout", replacePlaceholder);


function listDropdown (thing){
    resetListDropdown();
    var proxy = document.getElementById('list-proxy');
    var button = document.getElementById(thing.id);
    var list_number = button.id.slice(11);
    for (let i = 0;i < list_array.length;i++){
        if (list_array[i].id == ('list' + list_number)){
            proxy.innerHTML = i + 1;
        }
    }

    var dropdown = document.getElementById('list-dropdown');
    var scrolled = document.getElementById('list-group');
    var scrollLeft = scrolled.scrollLeft;
    dropdown.style.top = button.offsetTop + 34 + 'px';
    dropdown.style.left = (button.offsetLeft - scrollLeft) + 'px';
    if ((button.offsetLeft - scrollLeft) + 300 > window.innerWidth) {
        dropdown.style.left = window.innerWidth - 308 + 'px';
    } else if ((button.offsetLeft - scrollLeft) < 34){
        dropdown.style.left = '8px';
    }
    dropdown.style.display = "block";
}

function goAwayDroppy (){
    var dropdown = document.getElementById('list-dropdown');
    dropdown.style.display = "none";
}

function moveCardsMenu(){
    var bottom_old = document.getElementById('list-dropdown-bottom');
    bottom_old.style.display = "none";
    var spanny = document.getElementById('list-d-text');
    spanny.innerHTML = "Move Cards";
    var back = document.getElementById('list-d-back');
    back.style.visibility = "visible";
    var tip_top = document.createElement('div');
    var span_dog = document.createElement('span');
    span_dog.innerHTML = 'Destination:';
    var form = document.getElementById('list-dropdown-bottom4');
    var select = new ListOptions();
    var submit = document.createElement('input');
    submit.setAttribute('class', 'green-butt');
    submit.setAttribute('type', 'submit');
    // var form = document.createElement('form');
    form.setAttribute('onsubmit', 'return moveCards();');
    tip_top.append(span_dog);
    tip_top.append(select);
    form.append(tip_top);
    form.append(submit);
    form.style.display = "flex";
}

function moveCards() {
    let cards_to_move = [];
    var current_list_number = document.getElementById('list-proxy').textContent;
    var current_list = list_array[current_list_number - 1];
    var selected = document.getElementById('list-dropdown-bottom4').children[0].children[1].options[document.getElementById('list-dropdown-bottom4').children[0].children[1].selectedIndex].value;
    var target_id = list_array[selected - 1].id;
    var target_index = target_id.substr(4);
    var target = document.getElementById('new-cards' + target_index);

    var cards = current_list.children[1].children;
    console.log(cards);
    if (selected[selected.length - 1] == ')'){
        return false;
    } else {
        for (let card of cards){
            if (card.className == 'card-container'){
                cards_to_move.push(card);
            }
        }
        console.log(cards_to_move);
        for (let i = 0; i < cards_to_move.length;i++){
            target.append(cards_to_move[i]);
        }
    }
    target.style.padding = '0px 8px';
    goAwayDroppy();
    reprintLists();

    return false;
}

function deleteListMenu() {
    var bottom_old = document.getElementById('list-dropdown-bottom');
    bottom_old.style.display = "none";
    var spanny = document.getElementById('list-d-text');
    spanny.innerHTML = "Delete List";
    var back = document.getElementById('list-d-back');
    back.style.visibility = "visible";
    var span = document.createElement('span');
    span.setAttribute('id', 'top-span')
    span.innerHTML = 'Are you sure you want to delete this list?';
    var sub_span = document.createElement('span');
    sub_span.setAttribute('id', 'sub-span');
    sub_span.innerHTML = '(This action cannot be undone)';
    var button_container = document.createElement('div');
    button_container.setAttribute('id', 'list-yes-no');
    var yea = document.createElement('input');
    yea.setAttribute('class', 'green-butt');
    yea.setAttribute('type', 'button');
    yea.setAttribute('value', 'Yes');
    yea.setAttribute('onclick', 'deleteList()')
    var nay = document.createElement('input');
    nay.setAttribute('class', 'green-butt');
    nay.setAttribute('type', 'button');
    nay.setAttribute('value', 'No');
    nay.setAttribute('onclick', 'resetListDropdown();');
    button_container.append(yea);
    button_container.append(nay);
    var bottom = document.getElementById('list-dropdown-bottom3');
    bottom.style.display = "flex";
    bottom.append(span);
    bottom.append(sub_span);
    bottom.append(button_container);
}

function deleteList(){
    var list_number = document.getElementById('list-proxy').textContent;
    var index = list_number - 1;
    list_array.splice(index, 1);
    $.post('/lists/delete', {"index": `${index}`}, null)
    goAwayDroppy();
    reprintLists();
}

function moveListMenu() {
    var spanny = document.getElementById('list-d-text');
    spanny.innerHTML = "Move List";
    var back = document.getElementById('list-d-back');
    back.style.visibility = "visible";
    var span = document.createElement('span');
    span.innerHTML = 'Position:';
    var bottom_old = document.getElementById('list-dropdown-bottom');
    bottom_old.style.display = "none";
    var bottom = document.getElementById('list-dropdown-bottom2');
    bottom.style.display = "flex";
    var select = new ListOptions();
    var submit = document.createElement('input');
    submit.setAttribute('class', 'green-butt');
    submit.setAttribute('type', 'submit');
    var form = document.createElement('form');
    form.setAttribute('onsubmit', 'return moveList();');
    var myDiv = document.createElement('div');
    myDiv.append(span);
    myDiv.append(select);
    form.append(myDiv);
    form.append(submit);
    bottom.append(form);
}


function moveList(){
    var list_number = document.getElementById('list-proxy').textContent;
    var index = list_number - 1;
    var selected = document.forms[0].children[0].children[1].options[document.forms[0].children[0].children[1].selectedIndex].value;
    selected = selected - 1;

    if (selected[selected.length - 1] == ')'){
        return false;
    } else {
        for (let i = 0; i < list_array.length;i++){
            if (i == index){
                let move = list_array.splice(i, 1)[0];
                list_array.splice(selected, 0, move);

            }
        }
    }
    $.post('/lists/move',{"index": `${index}`, "selected": `${selected}`},null)
    goAwayDroppy();
    reprintLists();
    return false;
}

function reprintLists(){
    var lists = document.getElementById('new-lists');
    lists.innerHTML = '';
    for (let list of list_array){

        lists.append(list);
    }
}

function ListOptions(){
    var select = document.createElement('select');
    var current = document.getElementById('list-proxy').textContent;
    current = current - 1;
    
    for (let i = 0; i < list_array.length;i++){
        if ( i == current){
            var option = document.createElement('option')
            option.innerHTML = (i + 1) + " (current)";
            option.setAttribute('selected', 'selected');
            select.append(option);
        } else {
            var option = document.createElement('option')
            option.innerHTML = i + 1;
            select.append(option);
        }
    }

    return select;
}


function resetListDropdown(){
    var back = document.getElementById('list-d-back');
    back.style.visibility = "hidden";
    var spanny = document.getElementById('list-d-text');
    spanny.innerHTML = "List Actions";
    var bottom_old = document.getElementById('list-dropdown-bottom');
    bottom_old.style.display = "initial";
    var bottom2 = document.getElementById('list-dropdown-bottom2');
    bottom2.style.display = "none";
    var bottom3 = document.getElementById('list-dropdown-bottom3');
    bottom3.style.display = "none";
    bottom2.innerHTML = '';
    bottom3.innerHTML = '';
    var bottom4 = document.getElementById('list-dropdown-bottom4');
    bottom4.style.display = "none";
    bottom4.innerHTML = '';
}


function resetCards(){
    var clickout = document.getElementById('clickout-guy');
    clickout.style.display = 'none';
}

function sideMenu(){
    var menu = document.getElementById('side-menu');
    menu.style.display = 'flex';
}

function hideMenu() {
    var menu = document.getElementById('side-menu');
    menu.style.display = 'none';
}

function changeBgColor(){
    var bod = document.getElementById('bod');

    var picker = document.getElementById('color');
    var color = picker.value
    var men = document.getElementById('side-menu');
    bod.style.backgroundColor = color;
    picker.setAttribute('value', color);
    men.style.display = "none";
    return false;
}

//==Experimental==//

/*--- This is running on every click which may not be great--*/

document.body.addEventListener("mousedown", (evt) => {
    const flyoutElement = document.querySelector(".swim-lane-namer");
    let targetElement = evt.target; // clicked element
    const fly = document.querySelector('.swim-lane-placeholder');
    const fly_guy = document.querySelector('#list-dropdown');
    const fly_delete = document.getElementById('delete-guy');
    // const fly_lists = document.getElementsByClassName('list');
        do {
            if (targetElement == flyoutElement || targetElement == fly || targetElement == fly_guy || targetElement.className == 'list' || targetElement == fly_delete) {
                // This is a click inside. Do nothing, just return.
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

    // This is a click outside.
    
    resetCards();
    resetListDropdown();
    replacePlaceholder();
    goAwayDroppy ();
    deleteGuyByeBye();
});

//==Experimental above==//

// const fill = document.querySelector('.new-card');
// const empties = document.querySelectorAll('');

// console.log(fill)
// (x)

function deleteGuyByeBye(){
    const delete_guy = document.getElementById('delete-guy');
    delete_guy.style.display = "none";
}

function dragStart() {
    setTimeout(() => {

        this.classList.add('invisible');
        this.classList.add('chosen');
        this.style.height = "52px";
        this.nextElementSibling.style.display = "none";
        // this.classList.remove('new-card');
        // var inserts = document.getElementsByClassName('insert');
        // for(const insert of inserts){
        //     insert.addEventListener('dragover', dragOver);
        //     insert.addEventListener('dragenter', dragEnter);
        //     insert.addEventListener('dragleave', dragLeave);
        //     insert.addEventListener('drop', dragDrop);
        // }


    }, 0);
    var inserts = document.getElementsByClassName('insert');
    for(const insert of inserts){
        insert.addEventListener('dragover', dragOver);
        insert.addEventListener('dragenter', dragEnter);
        insert.addEventListener('dragleave', dragLeave);
        insert.addEventListener('drop', dragDrop);
    }
    var tops = document.getElementsByClassName('list-top');//if i add button to add card will need to change
    for (const top of tops){
        top.addEventListener('dragover', dragOverTop);
        top.addEventListener('dragleave', dragLeaveTop);
        top.addEventListener('drop', dragDropTop);
    }
    var bottoms = document.getElementsByClassName('card-add');
    for (const bottom of bottoms){
        bottom.addEventListener('dragover', dragOverBottom);
        bottom.addEventListener('dragleave', dragLeaveBottom);
        bottom.addEventListener('drop', dragDropBottom);
    }
    var cards = document.getElementsByClassName('new-card');
    for(const card of cards){
        card.addEventListener('dragover', dragOverCard);
        // card.addEventListener('dragenter', dragEnter);
        card.addEventListener('dragleave', dragLeaveCard);
        card.addEventListener('drop', dragDropCard);
        // card.addEventListener('drop', dragDrop);
    }
    // var hide = this.previousElementSibling.previousElementSibling;
    // hide.style.display = 'none';
}

// var drag_counter = 1;

function dragEnd() {

    var inserts = document.getElementsByClassName('insert');
    for (let item of inserts){
        item.style.height = "6px";
    }
    this.parentElement.parentElement.style.padding = "0px 8px";
    this.classList.remove('invisible');
    this.classList.remove('chosen');//no timer b/c stackflow says that dragDrop will fire first no matter what
    this.nextElementSibling.style.display = "block";
    var excepts = document.querySelectorAll('.insert-top');  //This line and line below not working for some reason
    for (let except of excepts){
        except.style.height = '0px';
    }
    this.style.height = "initial";
    // var hide = this.previousElementSibling.previousElementSibling;
    // hide.style.display = 'block';
}

function dragOver(e){
    e.preventDefault();

    this.style.height = '52px';
}

// create a class for the placeholder div

// find all divs with the placeholder class

// when leave is called
    // loop through the list of returned divs
        // delete all div

function dragEnter(e){
    e.preventDefault();
    // let parent = this.parentElement;
    // for (let item of card_array){
    //     if (item == this){
    //         var insert = document.createElement('div');
    //         insert.setAttribute('class', 'insert');
    //         insert.style.display = "block";
    //         parent.insertBefore(insert, this);
    //     }
    // }
}

function dragLeave(){
    // var inserts = document.getElementsByClassName('insert');
    // for(let item of inserts){
    //     item.style.display = "none";
    // }
    this.style.height = "6px";
}

function dragDrop(){
    var chosen = document.querySelector('.chosen');
    chosen.classList.add('new-card-blue');
    setTimeout(() => chosen.classList.remove('new-card-blue'), 1400);
    if(this.className.includes('insert-top')){
        this.insertAdjacentElement('afterend', chosen.parentElement);
    } else {
        this.parentElement.insertAdjacentElement('afterend', chosen.parentElement);
    }
}

function dragOverCard(e){
    e.preventDefault();
    var insert = this.nextElementSibling;
    insert.style.height = "52px";
}

function dragLeaveCard(){
    var insert = this.nextElementSibling;
    insert.style.height = "6px";
}

function dragDropCard(){
    var chosen = document.querySelector('.chosen');
    chosen.classList.add('new-card-blue');
    setTimeout(() => chosen.classList.remove('new-card-blue'), 1400);
    this.parentElement.insertAdjacentElement('afterend', chosen.parentElement);
}

function dragDropTop(){
    var chosen = document.querySelector('.chosen');
    chosen.classList.add('new-card-blue');
    setTimeout(() => chosen.classList.remove('new-card-blue'), 1400);
    this.nextElementSibling.children[0].insertAdjacentElement('afterend', chosen.parentElement);
}

function dragDropBottom(){
    var chosen = document.querySelector('.chosen');
    chosen.classList.add('new-card-blue');
    setTimeout(() => chosen.classList.remove('new-card-blue'), 1400);
    this.previousElementSibling.insertAdjacentElement('beforeend', chosen.parentElement);
}




function dragOverTop(e){
    e.preventDefault();
    var index = this.id[this.id.length - 1];
    var insert = document.getElementById(`insert${index}`);
    insert.style.height = "52px";
}

function dragLeaveTop(){
    var index = this.id[this.id.length - 1];
    var insert = document.getElementById(`insert${index}`);
    insert.style.height = "0px";
}




function dragOverBottom(e){
    e.preventDefault();
    var index = this.id[this.id.length - 1];
    var inserts = document.querySelectorAll(`#list${index} .insert`);
    let insert_array = [];
    for(let insert of inserts){
        if (insert.display != 'none'){
            insert_array.push(insert);
        }
    }
    var target = insert_array[insert_array.length - 1];

    target.style.height = "52px";
}

function dragLeaveBottom(){
    setTimeout(() => {
        var index = this.id[this.id.length - 1];
        var inserts = document.querySelectorAll(`#list${index} .insert`);
        let insert_array = [];
        for(let insert of inserts){
            if (insert.display != 'none'){
                insert_array.push(insert);
            }
        }
        var target = insert_array[insert_array.length - 1];
        target.style.height = "6px";
    }, 100);
}

$(document).ready(function(){
    let lists = [];
    $.get('/lists', function(res){
        lists = res;
        for (let item of lists){
            console.log(lists);
            createEmptyList(item.text, item.guid);
        }
    })
});



/*--- Things to fix

on edit, deleting card content deletes the card

on drag of card, hovering above insert above held div should not expand it

--*/