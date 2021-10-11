<?php
$dir=getcwd();
$largura=4000;
$altura=4000;

$numero_linhas=count(file($dir."/mapa_aristeu.txt"));
$altura_bloco=(int)$altura/$numero_linhas;

$fs_mapa=fopen($dir."/mapa_aristeu.txt","r");
echo $dir."/mapa_aristeu.txt","r";
$pontos=array();

$conta_linha=0;
while(!feof($fs_mapa)){
	$linha=fgets($fs_mapa);
	if (feof($fs_mapa)){break;}
	$largura_bloco=(int)$largura/strlen($linha);
 	$conta_caracter=0;

	while ($conta_caracter<strlen($linha)-1) {
		if ($linha[$conta_caracter]==="O"){
	$left=round($largura_bloco*$conta_caracter);
	$top=round($altura_bloco*$conta_linha);
	$right=round($largura_bloco*$conta_caracter) + round($largura_bloco);
	$bottom=round($altura_bloco*$conta_linha) + round($altura_bloco);

	$tamanho=count($pontos);
	echo "".$tamanho,"\n";
	if ($tamanho>0) {

		if ( $top==$pontos[$tamanho-1]["top"] && ($left==$pontos[$tamanho-1]["right"] || $left-1==$pontos[$tamanho-1]["right"] || $left+1==$pontos[$tamanho-1]["right"] || $left-2==$pontos[$tamanho-1]["right"] || $left+2==$pontos[$tamanho-1]["right"])) {
			$pontos[$tamanho-1]["right"]=$right;
			$pontos[$tamanho-1]["bottom"]=$bottom;
			}
		else 
			{
			$pontos[]=array("left"=>$left, "top"=>$top, "right"=>$right, "bottom"=>$bottom);
			}
	
	}		else 
			{
			$pontos[]=array("left"=>$left, "top"=>$top, "right"=>$right, "bottom"=>$bottom);
			}



        
//	echo '<img class="fixo '.$classe.'" id="bloco_'.$conta_linha.'_'.$conta_caracter.'" src="parede_pequena.jpeg" width="'.round($largura_bloco).'" height="'.round($altura_bloco).'" style="top: '.round($altura_bloco*$conta_linha).'; left: '.round($largura_bloco*$conta_caracter).';">';
		}
		$conta_caracter=$conta_caracter+1;
	}
	$conta_linha=$conta_linha + 1;


}

$tamanho=count($pontos);
for ($i=0; $i<$tamanho; $i++){
	for ($j=$i+1; $j<$tamanho; $j++){
		if ($pontos[$i]["left"]==$pontos[$j]["left"] && $pontos[$i]["right"]==$pontos[$j]["right"] && ($pontos[$i]["bottom"]==$pontos[$j]["top"] || $pontos[$i]["bottom"]+1==$pontos[$j]["top"] || $pontos[$i]["bottom"]-1==$pontos[$j]["top"] || $pontos[$i]["bottom"]+2==$pontos[$j]["top"] || $pontos[$i]["bottom"]-2==$pontos[$j]["top"])){
		   $pontos[$i]["bottom"]=$pontos[$j]["bottom"];
		   array_splice($pontos,$j,1);$j--;
		   $tamanho=count($pontos);
		}
	}


  
}

echo "\nTamanho final do Array:".count($pontos);
$mapa=array("pontos"=>$pontos);
$fp = fopen('mapa_aristeu3.json', 'w');
fwrite($fp, json_encode($mapa,JSON_PRETTY_PRINT));
fclose($fp);

?>
