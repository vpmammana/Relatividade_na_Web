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




export class movel {
   estado="indefinido";

constructor (id, arquivo){
	this.automatiza=null;
	this.velho_rotacao = 0;
	this.automatiza_giros=null;
	this.delta_t=10; // ms

	this.lista_de_detecao=[];

	this.conta_passos=0;
	
	this.conta_giros=0;

	this.fantasia=document.createElement("img");
	this.fantasia.style.pai = this;
	this.largura_container=document.body.clientWidth;
	this.altura_container=document.body.clientHeight;

	let that=this; // isto é necessário porque no ambito do tratamento de eventos onerror e onload do IMG, this eh o img
	document.body.appendChild(this.fantasia);
	this.fantasia.id=id;
	this.fantasia.style.position = "absolute";
	this.fantasia.onerror=function (){that.nao_achou_imagem()}
	this.fantasia.onload=function (){that.achou_imagem();}

	this.fantasia.src=arquivo;

	this.fantasia.alt="erro: "+arquivo+" não encontrado";

	this.largura=this.fantasia.width;
	this.altura =this.fantasia.height;
	this.velho_largura_percentual=100;
	this.velho_altura_percentual=100;


	this.posiciona_percentual(50,50);
	this.velho_posicao_percentual_x = 50;
	this.velho_posicao_percentual_y = 50;

	this.fantasia.style.visibility="visible";
}

get rotacao(){
	return this.velho_rotacao;
}

set rotacao(graus){
	this.rotaciona(graus);
	this.velho_rotacao = graus;
}

get estado_prop() {
	return this.estado;
}

set estado_prop(valor) {
	this.estado=valor;
}

get largura_percentual (){
	return this.velho_largura_percentual;
}

get altura_percentual (){
	return this.velho_altura_percentual;
}

set largura_percentual (value){
	this.tamanho_percentual(value,this.velho_altura_percentual);
}

set altura_percentual (value){
	this.tamanho_percentual(this.velho_largura_percentual,value);
}

set posicao_percentual_x (value){
	this.posiciona_percentual(value,this.velho_posicao_percentual_y);
}

set posicao_percentual_y (value){
	this.posiciona_percentual(this.velho_posicao_percentual_x,value);
}

get posicao_percentual_x (){
	return this.velho_posicao_percentual_x;
}

get posicao_percentual_y (){
	return this.velho_posicao_percentual_y;
}

achou_imagem(){
	this.estado="sucesso";
}


nao_achou_imagem(){
	this.estado="falhou";
}

rotaciona (graus){
	this.fantasia.style.transform="rotate(" + graus + "deg)";
}

posiciona_percentual(x,y){
	this.fantasia.style.top=((this.altura_container) - (this.altura_container) * y/100) - this.fantasia.height/2;
	this.fantasia.style.left=this.largura_container * x/100 - this.fantasia.width/2;
	this.velho_posicao_percentual_x=x;
	this.velho_posicao_percentual_y=y;

}

tamanho_percentual(x,y){
	this.velho_largura_percentual=x;
	this.velho_altura_percentual=y;
	this.fantasia.height = this.altura * y/100;
	this.fantasia.width  = this.largura * x/100;
	this.posiciona_percentual(this.posicao_percentual_x, this.posicao_percentual_y);
}

gira(delta_graus, giros){
	this.conta_giros = 0;
	let that=this
	this.automatiza_giros = setInterval(function ()
			{ 
				if ( that.conta_giros < giros ) {
					that.rotacao = that.rotacao + delta_graus;
					that.conta_giros++;
				}
				else {
					clearInterval(that.automatiza_giros);
				}
			},this.delta_t);	
	
}

verifica_se_bateu (){
	let i;
	for (i=0; i < this.lista_de_detecao.length; i++) {
		let objeto=this.lista_de_detecao[i];
		//console.log(objeto);
		let l1x = objeto.fantasia.getBoundingClientRect().left;
		let l1y = objeto.fantasia.getBoundingClientRect().top;
		let r1x = objeto.fantasia.getBoundingClientRect().right;
		let r1y = objeto.fantasia.getBoundingClientRect().bottom;
		
		let l2x = this.fantasia.getBoundingClientRect().left;
		let l2y = this.fantasia.getBoundingClientRect().top;
		let r2x = this.fantasia.getBoundingClientRect().right;
		let r2y = this.fantasia.getBoundingClientRect().bottom;
		//console.log( doOverlap( l1x, l1y,  r1x, r1y,  l2x, l2y,  r2x, r2y) );

		if ( doOverlap( l1x, l1y,  r1x, r1y,  l2x, l2y,  r2x, r2y) ) { console.log("bateu");}
		
	}


}

desliza(delta_x, delta_y, passos){
	this.conta_passos = 0;
	let that = this;
	this.automatiza = setInterval(function ()
			{ 
				if ( that.conta_passos < passos ) {
					that.verifica_se_bateu();
					that.posicao_percentual_x = that.posicao_percentual_x + delta_x;
					that.posicao_percentual_y = that.posicao_percentual_y + delta_y;
					that.conta_passos++;
				}
				else {
					clearInterval(that.automatiza);
				}
			},this.delta_t);	
		
}


acrescenta_em_detecao(objeto) {

	this.lista_de_detecao.push(objeto);

}


}
