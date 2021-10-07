export class movel {
   estado="indefinido";

constructor (id, arquivo){
	this.fantasia=document.createElement("img");
	this.largura_container=document.body.clientWidth;
	this.altura_container=document.body.clientHeight;
	let that=this; // isto é necessário porque no ambito do tratamento de eventos onerror e onload do IMG, this eh o img
	document.body.appendChild(this.fantasia);
	this.fantasia.id=id;
	this.fantasia.style.position = "absolute";
	this.fantasia.onerror=function (){that.nao_achou_imagem()}
	this.fantasia.onload=function (){that.achou_imagem();}
	//this.fantasia.onload=this.achou_imagem();
	this.fantasia.src=arquivo;
	this.largura=this.fantasia.width;
	this.altura =this.fantasia.height;
	this.velho_largura_percentual=100;
	this.velho_altura_percentual=100;

	this.fantasia.alt="erro: "+arquivo+" não encontrado";
	this.fantasia.style.visible=true;
	this.posiciona_percentual(50,50);
}

get estado_prop() {
	return this.estado;
}

set estado_prop(valor) {
	this.estado=valor;
}

get largura_percentual (){
	return this.fantasia.width;
}

get altura_percentual (){
	return this.fantasia.height;
}

set largura_percentual (value){
	this.tamanho_percentual(value,this.velho_altura_percentual);
}

set altura_percentual (value){
	this.tamanho_percentual(this.velho_largura_percentual,value);
}

achou_imagem(){
	this.estado="sucesso";
}


nao_achou_imagem(){
	this.estado="falhou";
}

posiciona_percentual(x,y){
	this.fantasia.style.top=((this.altura_container) - (this.altura_container) * y/100) - this.fantasia.height/2;
	this.fantasia.style.left=this.largura_container * x/100 - this.fantasia.width/2;
	this.posicao_percentual_x=x;
	this.posicao_percentual_y=y;

}

tamanho_percentual(x,y){
	this.velho_largura_percentual=x;
	this.velho_altura_percentual=y;
	this.fantasia.height = this.altura * y/100;
	this.fantasia.width  = this.largura * x/100;
	this.posiciona_percentual(this.posicao_percentual_x, this.posicao_percentual_y);
}
}
