<?php
$to = "managerbuilding26@gmail.com";
$subject = "Nouvelle demande";
$message = $_POST['message'];
$headers = "From: noreply@managerinvest.com";

if(mail($to, $subject, $message, $headers)){
    echo "Message envoyé !";
} else {
    echo "Erreur, réessayez.";
}
?>