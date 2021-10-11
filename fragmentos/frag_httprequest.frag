function busca_json(){
var resposta="";
var url='carrega_txt.php?arquivo='+nome_arquivo;
var oReq=new XMLHttpRequest();
           oReq.open("GET", url, false);
           oReq.onload = function (e) {
                     resposta=oReq.responseText;
             w.document.body.innerHTML=

"<style>    div {      width: 100%;      height: 100%;      border: 1px solid lightgray;    }    code { width: 100%; height: 100%;   
    background-color: black;      color: white;      white-space: pre;    }   h2 {  background-color: green;       }.codigo {   paddd
ing: 5px;   background-color: black;    color: white;width: -webkit-fit-content;height: -webkit-fit-content;width: -moz-fit-content;;
height: -moz-fit-content;  }    .tab {  border: 1px solid black;    padding: 5px;   background-color: gray; border-collapse: collapss
e;}</style><pre><div class='codigo' id='codigo_' style='border: 1px solid black'></div><pre>";
                     w.document.getElementById("codigo_").innerText=resposta;
                     }
           oReq.send();



}
