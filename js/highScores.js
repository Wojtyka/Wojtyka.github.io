/**
 * Created by Wojt
 */
function setup(){
   var btnName = document.getElementById("btnName");
    btnName.addEventListener('click', insertNameInInput);
}
function insertNameInInput(){
    var insertName = document.createElement("input");
    insertName.setAttribute("type", "text");
    insertName.setAttribute("name", "txtName");
    insertName.setAttribute("id","txtName");
    document.body.appendChild(insertName);
    var getName = insertName.value;
    if(typeof(Storage) !== "undefined"){
        localStorage.setItem("name",getName);
    }else{
        console.log("Sorry localstorage not supported");
    }
}


window.addEventListener('load', setup, true);