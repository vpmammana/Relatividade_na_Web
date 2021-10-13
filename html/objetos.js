// cuidado quando coloca animacao em objetos fixos. Por algum motivo corrompe o posicionamento. Eu acredito que seja um problema de timing
// cuidado com o timing de acrescenta_objeto_x

function intersect(a, b) { // retorna a interseccao de duas arrays, obtida do stackoverflow https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript/16227294#16227294
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}


function doOverlap( l1x, l1y,  r1x, r1y,  l2x, l2y,  r2x, r2y) {
//console.log(l1x+ " - " + l1y+ " - " +  r1x+ " - " + r1y+ " - " +  l2x+ " - " + l2y+ " - " +  r2x+ " - " + r2y);
 	// fonte: geeksforgeeks
        // To check if either rectangle is actually a line
        // For example : l1 ={-1,0} r1={1,1} l2={0,-1} r2={0,1}
 
        if (l1x == r1x || l1y == r1y ||
        l2x == r2x || l2y == r2y) {
            // the line cannot have positive overlap
            return false;
        }
 
        // If one rectangle is on left side of other
        if (l1x >= r2x || l2x >= r1x) {
            return false;
        }
 
        // If one rectangle is above other
        if (r1y <= l2y || r2y <= l1y) {
            return false;
        }
 
        return true;
    }

class sistema_de_colisao {

constructor (largura_tabuleiro, altura_tabuleiro, controle){
	this.controle = controle;
	this.largura_tabuleiro = largura_tabuleiro;
	this.altura_tabuleiro = altura_tabuleiro;
	this.matriz_colisao_x = [];
	this.matriz_colisao_y = [];
	this.inicializa_matrizes();

}

inicializa_matrizes(){
	let i;
  	for (i=0; i < this.largura_tabuleiro + 1; i++) {
		let objetos=[];
		this.matriz_colisao_x.push(objetos);
	}
	let j;
  	for (j=0; j < this.altura_tabuleiro + 1; j++) {
		let objetos=[];
		this.matriz_colisao_y.push(objetos);
	}
}


preenche_matriz_x (){ // preenche a partir de uma lista de objetos cuja colisao tem que ser monitorada. Mas pode ser preenchido de outra forma
// este metodo de preenchimento requer que toda a lista de objetos que colidem seja conhecida a priori e tem que zerar as matrizes
	let i,j;
	this.matriz_colisao_x.length = 0;
	for (i=0; i<this.largura_tabuleiro; i++){
	let objetos = [];
	  for (j=0; j < this.controle.objetos_que_colidem.length; j++) {
		let objeto = this.controle.objetos_que_colidem[j];
		let img_no_div = objeto.lista_de_fantasias[objeto.fantasia - 1];
		if ( i >= img_no_div.style.left.replace("px","") && i <= (img_no_div.style.left.replace("px","") + img_no_div.width))
			{ objetos.push(j); }
	  }
	this.matriz_colisao_x.push(objetos);
	}
	
}

preenche_matriz_y (){ // preenche a partir de uma lista de objetos cuja colisao tem que ser monitorada. Mas pode ser preenchido de outra forma
// este metodo de preenchimento requer que toda a lista de objetos que colidem seja conhecida a priori

	let i,j;
	this.matriz_colisao_y.length = 0;
	for (i=0; i<this.altura_tabuleiro; i++){
	let objetos = [];
	  for (j=0; j < this.controle.objetos_que_colidem.length; j++) {
		let objeto = this.controle.objetos_que_colidem[j];
		let img_no_div = objeto.lista_de_fantasias[objeto.fantasia - 1];
		if ( i >= img_no_div.style.top.replace("px","") && i <= (img_no_div.style.top.replace("px","") + img_no_div.height))
			{ objetos.push(j); }
	  }
	this.matriz_colisao_y.push(objetos);
	}
	
}

acrescenta_objeto_x (left, right, id){
	console.log(left + " - " + right + " - " + id);
	let i;
	for (i = left; i<= right; i++) {
		this.matriz_colisao_x[i].push(id);
	}

}

acrescenta_objeto_y (top, bottom, id){
console.log(top + " % " + " % " + bottom );
	let i;
	for (i = top; i<= bottom; i++) {
		this.matriz_colisao_y[i].push(id);
		}
}

retorna_colisao(x,y){

console.log("x");
console.log(this.matriz_colisao_x[x]);
console.log("y");
console.log(this.matriz_colisao_y[y]);

return intersect(this.matriz_colisao_x[x], this.matriz_colisao_y[y]);

}


} // fim class sistema_de_colisao

export class controle_geral {

constructor (div){
	this.forca_x = 100;
	this.forca_y = 100;
	this.auto_increment=0; // usado para gerar ids
	

	this.tabuleiro = div;
	this.selecionado = null; // objeto que estah sendo programado ou controlado
	this.pronto_para_animar=false; // espera ficar pronto para animar
	this.guarda_atrito       = 1; // coeficiente de atrito para todos os objetos deslizantes
	this.guarda_atrito_freio = 30;
	this.objetos_em_cena = []; // todos os objetos em cena que precisam ser animados
	this.objetos_fixos = []; // todos os objetos que nao precisam ser animados -> cenario
	this.objetos_que_colidem = [];
	this.delta_t_animacao=100; // tempo de repeticao do algoritmo de anomacao (setInterval)
	this.delta_t_simulacao= 0.01; // tempo de simulacao
	let that = this;
	this.palco = null;
	this.guarda_central = this.selecionado; // por enquanto null e soh pode ser definido pela propriedade
	this.espacamento_superior = 0;
	this.palco = new classe_palco(this.tabuleiro, null, this);
	this.palco.adiciona_event_listeners();
	this.sistema_de_colisao = new sistema_de_colisao (this.tabuleiro.offsetWidth, this.tabuleiro.offsetHeight, this)
}

set central(objeto){
	this.guarda_central = objeto;
	if (this.palco == null ) {alert("Erro: Por algum motivo o palco nao foi criado.");}
	else {this.palco.central = objeto;}
}

get central() {
	return this.guarda_central;
}

inicia_animacao(){
	let that=this;
	//this.animacao = setInterval(function () { that.animar();}, that.delta_t_animacao);
	this.animar(this);
}

animar(that) {
requestAnimationFrame(function () {that.animar(that);});
if (that.palco == null) { return;}
if ( that.pronto_para_animar == false) { return;} // ainda nao tem os imgs para animar
if (that.guarda_central == null) {that.guarda_central = that.selecionado;}
let i;

	for (i=0; i < that.objetos_em_cena.length; i++){
		
		let objeto = that.objetos_em_cena[i];
			objeto.guarda_vx = objeto.guarda_vx + objeto.guarda_ax * that.delta_t_simulacao;
			objeto.guarda_ax = - objeto.guarda_vx * (objeto.atrito + (objeto.freio * objeto.guarda_atrito_freio));
			objeto.guarda_vy = objeto.guarda_vy + objeto.guarda_ay * that.delta_t_simulacao;
			objeto.guarda_ay = - objeto.guarda_vy * (objeto.atrito + (objeto.freio * objeto.guarda_atrito_freio));
			objeto.posicao_percentual_x = objeto.posicao_percentual_x + objeto.guarda_vx * that.delta_t_simulacao;
			objeto.posicao_percentual_y = objeto.posicao_percentual_y + objeto.guarda_vy * that.delta_t_simulacao;
			objeto.freio = 0;
	
	
	} // fim for
} // fim metodo animacao

set atrito_freio(valor) {
	this.guarda_atrito_freio=valor;
let i;

	for (i=0; i < this.objetos_em_cena.length; i++){
		
		let objeto = this.objetos_em_cena[i];
		objeto.atrito = this.guarda_atrito_freio;

	}

}

get atrito_freio(){
	return guarda_atrito_freio;
}

set atrito_geral(valor) { // quando esta propriedade eh definida, sobescreve os atritos de todos os objetos em cena
	this.guarda_atrito=valor;
let i;

	for (i=0; i < this.objetos_em_cena.length; i++){
		
		let objeto = this.objetos_em_cena[i];
		objeto.atrito = this.guarda_atrito;

	}
} // fim class controle_geral

get atrito_geral(){
	return this.guarda_atrito;
}
}

export class classe_palco{

constructor (div, movel_central, controle) {
	
	this.tabuleiro = div;
	this.central = movel_central;
	this.borda_scroll_x = 15; // percentual da tela proibida para o movel ficar (e portanto eh preciso fazer scroll)
	this.borda_scroll_y = 15;
	this.tabuleiro.style.top = 0 + "px";
	this.tabuleiro.style.left = 0 + "px";
	this.controle = controle;
	this.cenario_json = null;
	
}



carrega_objetos_cenario(){ // carrega os objetos do cenario a partir do json que foi lido no servidor. Estes objetos nao serao animados (serao fixos)
var i;
for (i=0; i<this.cenario_json.pontos.length; i++){
	var ponto=this.cenario_json.pontos[i];
	var objeto_do_cenario = new movel("parede_bloco_"+i, "../fantasias/parede_pequena.jpeg", "parede_bloco_"+i, this.controle, "fixo", "img","sofre_colisao", this.chama_de_volta);
	//console.log(i+") auto: "+this.controle.auto_increment);
	let largura = Math.abs(ponto.right_percentual -  ponto.left_percentual  );
	let altura  = Math.abs(ponto.top_percentual   -  ponto.bottom_percentual);
//console.log(this.controle.objetos_fixos.length - 1 + "] L: " + objeto_do_cenario.posicao_percentual_x + " T:"+objeto_do_cenario.posicao_percentual_y + " H:" + objeto_do_cenario.altura_percentual + " W:" + objeto_do_cenario.largura_percentual  );
//console.log(this.controle.objetos_fixos.length - 1 + ") L: " + ponto.left_percentual + " R:"+ponto.right_percentual + " T:" + ponto.top_percentual + " B:" + ponto.bottom_percentual + " W:" + largura + " H:" + altura );
	objeto_do_cenario.posicao_percentual_x = parseFloat(ponto.left_percentual) + parseFloat(largura) / 2;
	objeto_do_cenario.posicao_percentual_y = parseFloat(ponto.top_percentual) + parseFloat(altura) /2;
	objeto_do_cenario.largura_percentual = parseFloat(largura) ;
	objeto_do_cenario.altura_percentual =  parseFloat(altura);
//console.log(this.controle.objetos_fixos.length - 1 + "> L: " + objeto_do_cenario.posicao_percentual_x + " T:"+objeto_do_cenario.posicao_percentual_y + " H:" + objeto_do_cenario.altura_percentual + " W:" + objeto_do_cenario.largura_percentual  );
	
}
}

carrega_json_cenario(){


var resposta="";
var url='../php/read_json.php?arquivo=mapa_aristeu_percentual.json';

let that = this;
var oReq=new XMLHttpRequest();
           oReq.open("GET", url, false);
           oReq.onload = function (e) {
                     that.cenario_json=JSON.parse(oReq.responseText);
		     setTimeout(function () {that.carrega_objetos_cenario();}, 100);
                     }
           oReq.send();

}

adiciona_event_listeners(){
//document.body.tabuleiro.tabIndex=0;
//document.body.tabuleiro.focus();
let that=this;
document.body.addEventListener( "keydown", 
function (e) { 
//console.log(e.key);
if (e.key == "ArrowRight") { console.log(e.key); that.central.Fx =   that.controle.forca_x; that.controle.palco.tabuleiro.focus();}
if (e.key == "ArrowLeft")  { console.log(e.key); that.central.Fx = - that.controle.forca_x; that.controle.palco.tabuleiro.focus();}
if (e.key == "ArrowUp")    { console.log(e.key); that.central.Fy =   that.controle.forca_y; that.controle.palco.tabuleiro.focus();}
if (e.key == "ArrowDown")  { console.log(e.key); that.central.Fy = - that.controle.forca_y; that.controle.palco.tabuleiro.focus();}
if (e.key == " ") { that.central.freio = 1;}


}, true)


}


corrige_palco(x_itz, y_itz) {

	if (this.central == null) { console.log("corrige_palco nao estah rodando porque o central nao foi definido"); return;}
	if (this.central.lista_de_fantasias.length < 1) {console.log("O central nao tem fantasias."); return;}
	var dx = 0;
	var dy = 0;
	
	var largura_tela = document.body.clientWidth;  
	var  altura_tela = document.body.clientHeight - this.controle.espacamento_superior; // para descontar o menu horizontal no topo da pagina 
	var mobile = this.central.lista_de_fantasias[this.central.fantasia - 1];
//	mobile.style.transition = "none";
// as posicoes  abaixo se referem aa posicao do movel
	var posicao_no_div_x_left =   parseInt(x_itz); 
	var posicao_no_div_x_right =  parseInt(x_itz) + mobile.width; 
	var posicao_no_div_y_top =    parseInt(y_itz); 
	var posicao_no_div_y_bottom = parseInt(y_itz) + mobile.height; 

	var posicao_na_tela_x_left  =  posicao_no_div_x_left +   parseInt( this.tabuleiro.style.left.replace("px","")); 
	var posicao_na_tela_x_right =  posicao_no_div_x_right +  parseInt( this.tabuleiro.style.left.replace("px","")); 
	var posicao_na_tela_y_top =    posicao_no_div_y_top +    parseInt( this.tabuleiro.style.top.replace("px","")); 
	var posicao_na_tela_y_bottom = posicao_no_div_y_bottom + parseInt( this.tabuleiro.style.top.replace("px","")); 
	var borda_proibida_x =  Math.round(largura_tela * this.borda_scroll_x/100);
	var borda_proibida_y =  Math.round( altura_tela * this.borda_scroll_y/100);

	if ( posicao_na_tela_x_left < borda_proibida_x ) {dx = ( borda_proibida_x - posicao_na_tela_x_left );}
	if ( posicao_na_tela_x_right > largura_tela - borda_proibida_x ) {dx = ( (largura_tela - borda_proibida_x) - posicao_na_tela_x_right );}

	if ( posicao_na_tela_y_top < borda_proibida_y + this.controle.espacamento_superior ) {dy = ( (borda_proibida_y + this.controle.espacamento_superior) - posicao_na_tela_y_top );}
	if ( posicao_na_tela_y_bottom > altura_tela - borda_proibida_y ) {dy = ( (altura_tela - borda_proibida_y) - posicao_na_tela_y_bottom );}
	if (dx !=0 ) {
		this.tabuleiro.style.left = parseInt(this.tabuleiro.style.left.replace("px","")) + dx + "px";
		}
		

	
	if (dy !=0  ) {
		this.tabuleiro.style.top = parseInt(this.tabuleiro.style.top.replace("px","")) + dy + "px";
		}
		
		window.requestAnimationFrame(function (){
			mobile.style.top  = y_itz + "px";
			mobile.style.left = x_itz + "px" ;
		mobile.style.visibility="visible";});
		
		



		//this.tabuleiro.style.top  = parseInt(this.tabuleiro.style.top.replace("px","") )  + dy + "px";
	
//mobile.style.visibility="visible";

}

}


export class movel {
   estado="indefinido";

constructor (id, arquivo, nome_fantasia, controle, tipo_objeto, tipo_tag, sofre_colisao, chama_de_volta){ // tipo tag determina se eh um IMG ou um DIV que guarda a fantasia
	this.chama_de_volta = chama_de_volta;
	this.tipo_tag = tipo_tag;
	this.controle = controle;
	this.automatiza=null;
	this.automatiza_giros=null;
	
	this.guarda_rotacao = 0;

	this.controle.auto_increment++;
	this.id = this.controle.auto_increment;

	this.delta_t=10; // ms

	this.guarda_atrito = controle.atrito_geral;
	this.guarda_atrito_freio = controle.guarda_atrito_freio;
        this.freio = 0;
	this.massa=0.5;

	this.guarda_vx=0;
	this.guarda_vy=0;
	this.guarda_ax=0;
	this.guarda_ay=0;
	this.guarda_Fx=0;
	this.guarda_Fy=0;
		
	this.max_tentativas_de_definir_tamanho = 30;
	this.tentativas_de_definir_tamanho = 0;	
	this.max_tentativas_de_definir_posicao = 30;
	this.tentativas_de_definir_posicao = 0;	

	this.lista_de_detecao=[];
	this.lista_de_fantasias=[];
	this.velho_fantasia=0;
	this.fantasia=0; // zero indica que não tem fantasia

	this.conta_passos=0;
	
	this.conta_giros=0;

	this.largura_container=document.getElementById("principal").clientWidth;
	this.altura_container=document.getElementById("principal").clientHeight;
	this.guarda_largura_percentual=100;
	this.guarda_altura_percentual=100;
	this.guarda_posicao_percentual_x = 50;
	this.guarda_posicao_percentual_y = 50;
	this.tipo_objeto = tipo_objeto;
	this.sofre_colisao = sofre_colisao;
	//console.log("colisaoi2: "+sofre_colisao);
	if (this.tipo_objeto == "movel")   { this.controle.objetos_em_cena.push(this);}
	if (this.tipo_objeto == "fixo") { this.controle.objetos_fixos.push(this);}
	if (this.sofre_colisao == "sofre_colisao") { let temp = this.controle.objetos_que_colidem.push(this);
							this.id_colisao  = temp - 1;
							}
	else {this.id_colisao = -1000;}

	this.acrescenta_fantasia(arquivo, nome_fantasia);

}

set atrito(valor) {
	this.guarda_atrito = valor;
}

get atrito() {
	return this.guarda_atrito;
}

set Fx(valor) {
	this.guarda_Fx = valor;
	this.impulso(this.guarda_Fx, 0);
	this.guarda_Fx = 0;	

}

set Fy(valor) {
	this.guarda_Fy = valor;
	this.impulso(0, this.guarda_Fy);
	this.guarda_Fy = 0;	

}

get Fx(){
	return this.guarda_Fx;
}

get Fy(){
	return this.guarda_Fy;
}

impulso (fx,fy) {
	this.guarda_ax = fx / this.massa;	
	this.guarda_ay = fy / this.massa;	

}

atualiza_fantasia() {
if (this.lista_de_fantasias.length < 1) {return;}
	if (this.velho_fantasia != this.fantasia) {
		if ( this.velho_fantasia >0 ) { this.lista_de_fantasias[this.velho_fantasia - 1].style.visibility = "hidden";}
		this.lista_de_fantasias[this.fantasia - 1].style.visibility = "visible";
		this.velho_fantasia = this.fantasia;
	}

}

set fantasia_atual(valor){
	this.fantasia=valor;
	this.tamanho_percentual(this.guarda_largura_percentual, this.guarda_altura_percentual);
}

get fantasia_atual(){
	return this.fantasia;
}

get rotacao(){
	return this.guarda_rotacao;
}

set rotacao(graus){
	this.rotaciona(graus);
	this.guarda_rotacao = graus;
}

get estado_prop() {
	return this.estado;
}

set estado_prop(valor) {
	this.estado=valor;
}

get largura_percentual (){
	return this.guarda_largura_percentual;
}

get altura_percentual (){
	return this.guarda_altura_percentual;
}

set largura_percentual (value){
	this.tamanho_percentual(value,this.guarda_altura_percentual);
	//console.log("largura: "+value + " guarda largura:"+ this.guarda_largura_percentual);
}

set altura_percentual (value){
	this.tamanho_percentual(this.guarda_largura_percentual,value);
}

set posicao_percentual_x (value){
	this.posiciona_percentual(value,this.guarda_posicao_percentual_y);
}

set posicao_percentual_y (value){
	this.posiciona_percentual(this.guarda_posicao_percentual_x,value);
}

get posicao_percentual_x (){
	return this.guarda_posicao_percentual_x;
}

get posicao_percentual_y (){
	return this.guarda_posicao_percentual_y;
}

achou_imagem(){
	this.estado="sucesso";
}


nao_achou_imagem(){
	this.estado="falhou";
	alert("Nao conseguiu carregar imagem.");
}

rotaciona (graus){
	this.lista_de_fantasias[this.fantasia - 1].style.transform="rotate(" + graus + "deg)";
	this.atualiza_fantasia();
}

posiciona_percentual(x,y){
//console.log("Tentativa: " + this.tentativas_de_definir_posicao);
	// talvez fosse legal pegar de novo o valor da largura do container caso o usuario mude o tamanho da janela depois que o jogo comecou
	if (this.largura_container >= this.altura_container) {
		var fator_x = 100;
		var fator_y = this.altura_container / this.largura_container *100;
	}

	if (this.largura_container < this.altura_container) {
		var fator_y = 100;
		var fator_x = this.largura_container / this.altura_container * 100;
	}

	this.guarda_posicao_percentual_x=x;
	this.guarda_posicao_percentual_y=y;

if (this.lista_de_fantasias.length > 0) {

	let x_itz = Math.round(this.largura_container * x/fator_x - this.lista_de_fantasias[this.fantasia - 1].width/2);
	let y_itz = Math.round(((this.altura_container) - (this.altura_container) * y/ fator_y ) - this.lista_de_fantasias[this.fantasia - 1].height/2);
	
	if (this.tipo_objeto == "movel") {this.lista_de_fantasias[this.fantasia - 1].style.transition = "all 0.05s linear";} // se o objeto eh fixo e demora para carregar, essa animacao dah problema... 
	this.tentativas_de_definir_posicao = 0;
	
	if (this == this.controle.central && this != null && this != undefined ) {
		this.controle.palco.corrige_palco(x_itz, y_itz);

	}
	else
	{
		this.lista_de_fantasias[this.fantasia - 1].style.top  = y_itz + "px"; 
		this.lista_de_fantasias[this.fantasia - 1].style.left = x_itz + "px" ;
	}
	

	this.atualiza_fantasia();
} else {
	this.tentativas_de_definir_posicao++; // caso a lista de fantasias esteja vazia, pode ser por conta de demorar para carregar do servidor, entao tem que tentar + 1 vez
	if (this.tentativas_de_definir_posicao < this.max_tentativas_de_definir_posicao) { let that=this; setTimeout(function () {that.posiciona_percentual(x,y);}, 100)}
	else {alert("Nao foi possivel definir a posicao da fantasia. Provavelmente o tempo de carga da fantasia estah muito longo.");}

}

}



tamanho_percentual(x,y){
//console.log("tentativa tamanho: "+ this.tentativas_de_definir_tamanho);
	this.guarda_largura_percentual=x;
	this.guarda_altura_percentual=y;
	//console.log(this.lista_de_fantasias[0]);
	//console.log(this.fantasia);
if (this.fantasia > 0) {
	this.tentativas_de_definir_tamanho = 0;
	this.lista_de_fantasias[this.fantasia - 1].height = Math.round(this.altura_container * y/100 );
	this.lista_de_fantasias[this.fantasia - 1].width  = Math.round(this.largura_container * x/100);
	this.posiciona_percentual(this.posicao_percentual_x, this.posicao_percentual_y);
	this.atualiza_fantasia();
}
else {
	this.tentativas_de_definir_tamanho++;
	if (this.tentativas_de_definir_tamanho < this.max_tentativas_de_definir_tamanho) { let that=this; setTimeout(function () {that.tamanho_percentual(x,y);}, 100)}
	else {alert("Nao foi possivel definir o tamanho da fantasia. Provavelmente o tempo de carga da fantasia estah muito longo.");}
}

}

gira(delta_graus, giros){
	if ( this.automatiza_giros != null ) { clearInterval(this.automatiza_giros); this.automatiza_giros=null;}
	this.conta_giros = 0;
	let that=this;
	
	this.automatiza_giros = setInterval(function ()
			{ 
				//console.log(that.rotacao);
				if ( that.conta_giros < parseFloat(giros) ) {
					that.rotacao = that.rotacao + parseFloat(delta_graus);
					that.conta_giros++;
				}
				else {
					clearInterval(that.automatiza_giros);
					that.automatiza_giros = null;
				}
			},this.delta_t);	
	
}

para_giro(){
 	if (this.automatiza_giros != null ) {clearInterval(this.automatiza_giros); this.automatiza_giros=null;}
}

verifica_se_bateu (){
	let i;
	for (i=0; i < this.lista_de_detecao.length; i++) {
		let objeto=this.lista_de_detecao[i];
		//console.log(objeto);
		let l1x = parseInt(objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().left);
		let l1y = parseInt(objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().top);
		let r1x = parseInt(objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().right);
		let r1y = parseInt(objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().bottom);
		
		let l2x = parseInt(this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().left);
		let l2y = parseInt(this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().top);
		let r2x = parseInt(this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().right);
		let r2y = parseInt(this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().bottom);
		//console.log( doOverlap( l1x, l1y,  r1x, r1y,  l2x, l2y,  r2x, r2y) );

		if ( doOverlap( l1x, l1y,  r1x, r1y,  l2x, l2y,  r2x, r2y) ) { console.log("bateu");}
		
	}


}

desliza(delta_x, delta_y, passos){
	this.conta_passos = 0;
	let that = this;
	this.automatiza = setInterval(function ()
			{ 
				if ( that.conta_passos < parseFloat(passos) ) {
					that.verifica_se_bateu();
					that.posicao_percentual_x = that.posicao_percentual_x + parseFloat(delta_x);
					that.posicao_percentual_y = that.posicao_percentual_y + parseFloat(delta_y);
					that.conta_passos++;
				}
				else {
					clearInterval(that.automatiza);
					that.automatiza = null;
				}
			},this.delta_t);	
		
}

para_desliza() {
	if (this.automatiza != null) {clearInterval(this.automatiza); this.automatiza=null;}	
}


proxima_fantasia(){
	this.fantasia++;
	if (this.fantasia > this.lista_de_fantasias.length) {this.fantasia = 1;} // verificar isso aqui. nao testado
	this.atualiza_fantasia();	
}



acrescenta_fantasia(arquivo, nome){

	let fantasy=document.createElement("img");
	fantasy.style.pai = this;
	//fantasy.style.transition="all 0.05s linear";
	//fantasy.style.transitionTimingFunction="linear";	
	fantasy.style.visibility="hidden";
	document.getElementById("principal").appendChild(fantasy);
	fantasy.id=this.id + "_" + nome;
	fantasy.style.display="block";
	fantasy.style.position = "absolute";
	let that = this;
	fantasy.onerror=function (){that.nao_achou_imagem()}
	fantasy.onload=function (){that.achou_imagem();}

	fantasy.src=arquivo;

fantasy.addEventListener("click", ()=> {
	controle.selecionado = that;
	controle.central = that;
        }, true);


	fantasy.alt="erro: "+arquivo+" não encontrado";

    fantasy.addEventListener("load", function () {

	that.controle.pronto_para_animar = true; // isso aqui provavelmente estah errado porque refere-se apenas aa fantasia corrente do presente movel. Tem muitos moveis. (resposta: Eh que basta um estar pronto para animar, portanto nao precisa esperar todos)
	that.lista_de_fantasias.push(fantasy);
	that.velho_fantasia = that.fantasia;
	that.fantasia = that.lista_de_fantasias.length;
		that.largura = this.width;
		that.altura  = this.height;
		that.tamanho_percentual(that.guarda_largura_percentual, that.guarda_largura_percentual);
if (that.sofre_colisao == "sofre_colisao"){ // cuidado com o timing desse if. Pode ser que ele ocorra antes de saber a posicao do IMG
setTimeout(function (){
console.log("id_colisao: "+that.id_colisao);
	that.controle.sistema_de_colisao.acrescenta_objeto_x(parseInt(fantasy.style.left.replace("px","")), parseInt(fantasy.style.left.replace("px","")) + fantasy.width, that.id_colisao);
	that.controle.sistema_de_colisao.acrescenta_objeto_y(parseInt(fantasy.style.top.replace("px","")), parseInt(fantasy.style.top.replace("px","")) + fantasy.height, that.id_colisao);	

}, 100);

}

},false);

}


acrescenta_em_detecao(objeto) {

	this.lista_de_detecao.push(objeto);

}


}
