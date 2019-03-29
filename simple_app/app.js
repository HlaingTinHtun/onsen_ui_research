window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};


document.addEventListener('init',function(event){
  if (event.target.id == 'home') {
    connectDb();
    retreiveItems();
  }
})



var db = null;

function error(query,e){
  alert("Something gone wrong" + e.Message);
}

function success(query,s){
  retreiveItems();
}

function connectDb(){
  db = openDatabase("ItemList","1","Item List Test",1024*1024);

  db.transaction(function(query){
    query.executeSql("CREATE TABLE IF NOT EXISTS items (ID INTEGER PRIMARY KEY ASC, item TEXT)",[]);
  });
}

function retreiveItems(){
  db.transaction(function(query){
    query.executeSql("SELECT * FROM items",[],renderItems,error);
  });
}

function renderItems(query,rs){
  var output = "";
  var list = document.getElementById('itemlist');

  for(i = 0; i < rs.rows.length; i++){
    var row = rs.rows.item(i);

    output += "<ons-list-item>" + row.item +
    "<div class=\"right\"> <ons-button onclick='deleteItem("+ row.ID+");'><ons-icon icon=\"trash\"></ons-icon></ons-button></div>" +
    "</ons-list-item>";
  }

  list.innerHTML = output;
}

function addItem(){
  var textbox = document.getElementById("item");
  var value = textbox.value;

  db.transaction(function(query){
    query.executeSql("INSERT INTO items (item) VALUES (?)", [value], success, error);
  });

  textbox.value = "";
  fn.load('home.html');

}

function deleteItem(id){
  db.transaction(function(query){
    query.executeSql("DELETE FROM items WHERE id=?",[id],success, error);
  })
}
