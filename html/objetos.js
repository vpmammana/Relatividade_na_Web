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


export class controle_geral {

constructor (div){
	this.forca_x = 1000;
	this.forca_y = 1000;
	

	this.tabuleiro = div;
	this.selecionado = null; // objeto que estah sendo programado ou controlado
	this.pronto_para_animar=false; // espera ficar pronto para animar
	this.guarda_atrito       = 1; // coeficiente de atrito para todos os objetos deslizantes
	this.guarda_atrito_freio = 30;
	this.objetos_em_cena = []; // todos os objetos em cena que precisam ser animados
	this.delta_t_animacao=50; // tempo de repeticao do algoritmo de anomacao (setInterval)
	this.delta_t_simulacao= 0.01; // tempo de simulacao
	let that = this;
	this.palco = null;
	this.guarda_central = this.selecionado; // por enquanto null e soh pode ser definido pela propriedade
	this.espacamento_superior = 0;
	this.palco = new classe_palco(this.tabuleiro, null, this);
	this.palco.adiciona_event_listeners();
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
	this.animacao = setInterval(function () { that.animar();}, that.delta_t_animacao);

}

animar() {
if (this.palco == null) { return;}
if ( this.pronto_para_animar == false) { return;} // ainda nao tem os imgs para animar
if (this.guarda_central == null) {this.guarda_central = this.selecionado;}
let i;

	for (i=0; i < this.objetos_em_cena.length; i++){
		
		let objeto = this.objetos_em_cena[i];
			objeto.guarda_vx = objeto.guarda_vx + objeto.guarda_ax * this.delta_t_simulacao;
			objeto.guarda_ax = - objeto.guarda_vx * (objeto.atrito + (objeto.freio * objeto.guarda_atrito_freio));
			objeto.guarda_vy = objeto.guarda_vy + objeto.guarda_ay * this.delta_t_simulacao;
			objeto.guarda_ay = - objeto.guarda_vy * (objeto.atrito + (objeto.freio * objeto.guarda_atrito_freio));
			objeto.posicao_percentual_x = objeto.posicao_percentual_x + objeto.guarda_vx * this.delta_t_simulacao;
			objeto.posicao_percentual_y = objeto.posicao_percentual_y + objeto.guarda_vy * this.delta_t_simulacao;
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
	
}

adiciona_event_listeners(){
this.tabuleiro.tabIndex=0;
this.tabuleiro.focus();
let that=this;
this.tabuleiro.addEventListener( "keydown", 
function (e) { 
console.log(e.key);
if (e.key == "ArrowRight") { that.central.Fx =   that.controle.forca_x;}
if (e.key == "ArrowLeft")  { that.central.Fx = - that.controle.forca_x;}
if (e.key == "ArrowUp")    { that.central.Fy =   that.controle.forca_y;}
if (e.key == "ArrowDown") { that.central.Fy = - that.controle.forca_y;}
if (e.key == " ") { that.central.freio = 1;}


}, true)


}


corrige_palco() {

	if (this.central == null) { console.log("corrige_palco nao estah rodando porque o central nao foi definido"); return;}
	if (this.central.lista_de_fantasias.length < 1) {console.log("O central nao tem fantasias."); return;}
	var dx = 0;
	var dy = 0;
	
	var largura_tela = document.body.clientWidth;  
	var  altura_tela = document.body.clientHeight - this.controle.espacamento_superior; // para descontar o menu horizontal no topo da pagina 
	var mobile = this.central.lista_de_fantasias[this.central.fantasia - 1];

// as posicoes  abaixo se referem aa posicao do movel
	var posicao_no_div_x_left =   parseInt(mobile.style.left.replace("px","")); 
	var posicao_no_div_x_right =  parseInt(mobile.style.left.replace("px","")) + mobile.width; 
	var posicao_no_div_y_top =    parseInt( mobile.style.top.replace("px","")); 
	var posicao_no_div_y_bottom = parseInt( mobile.style.top.replace("px","")) + mobile.height; 

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

	this.tabuleiro.style.left = parseInt(this.tabuleiro.style.left.replace("px","")) + dx + "px";
	this.tabuleiro.style.top  = parseInt(this.tabuleiro.style.top.replace("px","") )  + dy + "px";
}

}



export class movel {
   estado="indefinido";

constructor (id, arquivo, nome_fantasia, controle){
	this.controle = controle;
	this.automatiza=null;
	this.automatiza_giros=null;
	
	this.guarda_rotacao = 0;
	this.id = id;
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
}

rotaciona (graus){
	this.lista_de_fantasias[this.fantasia - 1].style.transform="rotate(" + graus + "deg)";
	this.atualiza_fantasia();
}

posiciona_percentual(x,y){
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
	this.lista_de_fantasias[this.fantasia - 1].style.top= Math.round(((this.altura_container) - (this.altura_container) * y/ fator_y ) - this.lista_de_fantasias[this.fantasia - 1].height/2) + "px";
	this.lista_de_fantasias[this.fantasia - 1].style.left=Math.round(this.largura_container * x/fator_x - this.lista_de_fantasias[this.fantasia - 1].width/2) + "px";
	if (this == this.controle.central ) {this.controle.palco.corrige_palco();}
}
	this.atualiza_fantasia();

}



tamanho_percentual(x,y){
	this.guarda_largura_percentual=x;
	this.guarda_altura_percentual=y;
	//console.log(this.lista_de_fantasias[0]);
	//console.log(this.fantasia);
	this.lista_de_fantasias[this.fantasia - 1].height = this.altura * y/100 ;
	this.lista_de_fantasias[this.fantasia - 1].width  = this.largura * x/100;
	this.posiciona_percentual(this.posicao_percentual_x, this.posicao_percentual_y);
	this.atualiza_fantasia();
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
	this.atualiza_fantasia();	
}

acrescenta_fantasia(arquivo, nome){

	let fantasy=document.createElement("img");
	fantasy.style.pai = this;
	
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
	that.controle.pronto_para_animar = true;
	that.controle.objetos_em_cena.push(that);
	that.lista_de_fantasias.push(fantasy);
	that.velho_fantasia = that.fantasia;
	that.fantasia = that.lista_de_fantasias.length;
		that.largura = this.width;
		that.altura  = this.height;
		that.tamanho_percentual(that.guarda_largura_percentual, that.guarda_largura_percentual);
	});
}


acrescenta_em_detecao(objeto) {

	this.lista_de_detecao.push(objeto);

}


}
