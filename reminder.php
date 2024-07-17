<?php
// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/calender/PHPMailer/src/Exception.php';
require 'C:/xampp/htdocs/calender/PHPMailer/src/PHPMailer.php';
require 'C:/xampp/htdocs/calender/PHPMailer/src/SMTP.php';

// Database connection setup
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "availability";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


?>

<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <p>Beste,</p>
    <p>Gelieve uw beschikbaarheden voor komende week in te vullen op <a href="https://calendar.runningonempty.be">calendar.runningonempty.be</a></p>
    <p>Morgen om 18h komen de beschikbaarheden voor iedereen per mail</p>
    <br>
    <p>Bedankt om geregeld de beschikbaarheden in te vullen.</p>
    <br>
    <br>
    <p>Dit is een automatische mail die u wekelijks ontvangt</p>
    <br>
    <br>
    <p>Running On Empty<br>
    <a href="http://www.runningonempty.be">www.runningonempty.be</a></p>
    <img src="http://45.137.205.232/calender/logo.png" alt="logo">
</body>
</html>

<?php
$email_body = ob_get_clean();

// Check if email body is generated
if (empty($email_body)) {
    die('Error: Email body is empty.');
}

// Send the email
$mail = new PHPMailer;
$mail->isSMTP();
$mail->Host = 'smtp-auth.mailprotect.be';
$mail->SMTPAuth = true;
$mail->Username = 'noreply@runningonempty.be';
$mail->Password = '08a9M17k4BT9RMHHBrjb';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('noreply@runningonempty.be', 'Running On Empty');
$mail->addAddress('calendar@runningonempty.be'); // Add your recipients here

$mail->isHTML(true);
$mail->Subject = 'Beschikbaarheden invullen';
$mail->Body    = $email_body;

$mail->SMTPDebug = 2; // Enable verbose debug output

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
?>
