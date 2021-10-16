class configuracoes {
constructor(){
	this.altura = 150;
	this.largura= 150;
	this.conta_id = 0;
	this.elemento_pai = null;
	this.esquerda = 0;
	this.topo = 0;
}
}

export class bloco {

constructor (conta_id, bloco_superior, condicional, elemento_pai, esquerda, topo){
	this.configuracoes = configuracoes;
	this.pc = 0 // program count
	this.conta_id = conta_id;
	this.elemento_pai = elemento_pai;
	this.instrucoes = [];
	this.condicional = [];
	this.condiciona.push(condicional);
	this.guarda_altura =  this.configuracoes.altura;
	this.guarda_largura = this.configuracoes.largura;
	this.topo = topo;
	this.esquerda = esquerda;
	this.backgroundcolor = "gray";
	this.borderradius = "25px";
	this.borda = "5px solid white";
	this.face = this.retorna_face();
}

retorna_face(){
	let div = document.createElement("div"); 
	div.stye.pai = this;
	div.style.visibility = "visible";
	this.elemento_pai.appendChild(div);
	div.id = "bloco_" + this.conta_id;
	div.conta_id++;
	div.style.display="block";
	div.style.position="absolute";
	div.style.backgroundColor = this.configuracoes.backgroundcolor;
	div.style.borderRadius = this.configuracoes.borderradius;
	div.style.border = this.configuracoes.borda;
}

} // fim class bloco
