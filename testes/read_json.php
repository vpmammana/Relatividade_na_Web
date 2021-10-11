<?php

if(isset($_GET["arquivo"])){
  $arquivo = $_GET["arquivo"];
} else {$arquivo="mapa_aristeu_percentual.json";}


$fs_mapa=fopen($arquivo,"r");
while(!feof($fs_mapa)){
	$linha=fgets($fs_mapa);
	echo $linha;
	if (feof($fs_mapa)){break;}
}

?>
