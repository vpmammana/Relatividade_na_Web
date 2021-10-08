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

constructor (){

	this.selecionado = null;
	this.atrito      = 1; // coeficiente de atrito para todos os objetos deslizantes
	this.objetos_em_cena = [];
	this.delta_t_animacao=10;
	this.delta_t_simulacao= 0.01;
	let that = this;
	this.animacao = setInterval(function () { that.animar();}, that.delta_t_animacao);
}

animar() {

let i;

	for (i=0; i < this.objetos_em_cena.length; i++){
		
		let objeto = this.objetos_em_cena[i];
			objeto.guarda_vx = objeto.guarda_vx + objeto.guarda_ax * this.delta_t_simulacao;
			objeto.guarda_ax = - objeto.guarda_vx * objeto.atrito;
			objeto.guarda_vy = objeto.guarda_vy + objeto.guarda_ay * this.delta_t_simulacao;
			objeto.guarda_ay = - objeto.guarda_vy * objeto.atrito;
			objeto.posicao_percentual_x = objeto.posicao_percentual_x + objeto.guarda_vx * this.delta_t_simulacao;
			objeto.posicao_percentual_y = objeto.posicao_percentual_y + objeto.guarda_vy * this.delta_t_simulacao;
	
	
	} // fim for

	
} // fim metodo animacao

} // fim class controle_geral

export class movel {
   estado="indefinido";

constructor (id, arquivo, nome_fantasia, controle){
	this.automatiza=null;
	this.automatiza_giros=null;
	
	this.guarda_rotacao = 0;
	this.id = id;
	this.delta_t=10; // ms

	this.atrito = controle.atrito;

	this.massa=1;

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

	this.largura_container=document.body.clientWidth;
	this.altura_container=document.body.clientHeight;
	this.guarda_largura_percentual=100;
	this.guarda_altura_percentual=100;
	this.guarda_posicao_percentual_x = 50;
	this.guarda_posicao_percentual_y = 50;
	this.acrescenta_fantasia(arquivo, nome_fantasia);
	controle.objetos_em_cena.push(this);

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
	this.lista_de_fantasias[this.fantasia - 1].style.top=((this.altura_container) - (this.altura_container) * y/100) - this.lista_de_fantasias[this.fantasia - 1].height/2;
	this.lista_de_fantasias[this.fantasia - 1].style.left=this.largura_container * x/100 - this.lista_de_fantasias[this.fantasia - 1].width/2;
	this.guarda_posicao_percentual_x=x;
	this.guarda_posicao_percentual_y=y;
	this.atualiza_fantasia();

}



tamanho_percentual(x,y){
	this.guarda_largura_percentual=x;
	this.guarda_altura_percentual=y;
	console.log(this.lista_de_fantasias[0]);
	console.log(this.fantasia);
	this.lista_de_fantasias[this.fantasia - 1].height = this.altura * y/100;
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
				console.log(that.rotacao);
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
		let l1x = objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().left;
		let l1y = objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().top;
		let r1x = objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().right;
		let r1y = objeto.lista_de_fantasias[objeto.fantasia -1].getBoundingClientRect().bottom;
		
		let l2x = this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().left;
		let l2y = this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().top;
		let r2x = this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().right;
		let r2y = this.lista_de_fantasias[this.fantasia - 1].getBoundingClientRect().bottom;
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
	document.body.appendChild(fantasy);
	fantasy.id=this.id + "_" + nome;
	fantasy.style.position = "absolute";
	let that = this;
	fantasy.onerror=function (){that.nao_achou_imagem()}
	fantasy.onload=function (){that.achou_imagem();}

	fantasy.src=arquivo;

	fantasy.addEventListener("click", ()=> {
		controle.selecionado = that;
          });


	fantasy.alt="erro: "+arquivo+" não encontrado";
	this.lista_de_fantasias.push(fantasy);
	this.velho_fantasia = this.fantasia;
	this.fantasia = this.lista_de_fantasias.length;

	this.largura = fantasy.width;
	this.altura  = fantasy.height;
	this.tamanho_percentual(this.guarda_largura_percentual, this.guarda_largura_percentual);

}


acrescenta_em_detecao(objeto) {

	this.lista_de_detecao.push(objeto);

}


}
