$fs_mapa=fopen($dir."/mapa_aristeu.txt","r");
while(!feof($fs_mapa)){
	$linha=fgets($fs_mapa);
	if (feof($fs_mapa)){break;}
