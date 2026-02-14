<?php
$data = json_decode(file_get_contents('php://input'), true);
$file = 'retraits.json';
$retraits = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

if(isset($data['action']) && $data['action']=='valider'){
    $index = $data['index'];
    if(isset($retraits[$index])) $retraits[$index]['statut']="Validé";
    file_put_contents($file,json_encode($retraits));
    echo json_encode(["success"=>true]);
    exit;
}

$nom = $data['nom'];
$num = $data['num'];
$montant = $data['montant'];
$pays = $data['pays'];
$operateur = $data['operateur'];
$date = date('d/m/Y H:i:s');

$retraits[] = ["nom"=>$nom,"num"=>$num,"montant"=>$montant,"pays"=>$pays,"operateur"=>$operateur,"statut"=>"En attente","date"=>$date];
file_put_contents($file,json_encode($retraits));

// Envoi email
$to = "managerbuilding26@gmail.com";
$subject = "Nouvelle demande de retrait";
$message = "Nom : $nom\nNuméro : $num\nMontant : $montant\nPays : $pays\nOpérateur : $operateur\nDate : $date";
$headers = "From: no-reply@gainmaxvisuel.com";
mail($to,$subject,$message,$headers);

echo json_encode(["success"=>true]);
?>