function Le_Json($arquivo){

$str = file_get_contents($arquivo);

$json = json_decode($str, true);

$tamanho= count($json["pontos"]);

for ($i=0; $i<$tamanho; $i++){
        echo '<div class="parede" id="teste_'.$i.'" style="background-color: white; background-image: url(parede_pequena.jpeg); background-repeat: repeat; position: absolute; z-index: 300; border: 1px solid black; top: '.$json["pontos"][$i]["top"].'; left: '.$json["pontos"][$i]["left"].'; width: '.round($json["pontos"][$i]["right"] - $json["pontos"][$i]["left"]).'; height: '.round($json["pontos"][$i]["bottom"] - $json["pontos"][$i]["top"]).'"></div>';
}

}
