<?php
// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader if you are using Composer
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

// Fetch the current week's data
$startDate = date('Y-m-d', strtotime('monday this week'));
$endDate = date('Y-m-d', strtotime('sunday this week'));

$sql = "SELECT id, name, date, start_time, end_time, status, user_id FROM availabilities WHERE date BETWEEN '$startDate' AND '$endDate'";
$result = $conn->query($sql);

$availabilities = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $availabilities[] = $row;
    }
}

$conn->close();

// Format data into an HTML email
ob_start();
?>

<!DOCTYPE html>
<html>
<head>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
    </style>
</head>
<body>
    <p>Beste,</p>
    <p>In onderstaande tabel kunt u de beschikbaarheden raadplegen voor deze week.</p>
    <table>
        <tr>
            <th>Persoon</th>
            <th>Datum</th>
            <th>Starttijd</th>
            <th>Eindtijd</th>
            <th>Status</th>
        </tr>
        <?php foreach($availabilities as $row): ?>
        <tr>
            <td><?php echo $row['name']; ?></td>
            <td><?php echo $row['date']; ?></td>
            <td><?php echo $row['start_time']; ?></td>
            <td><?php echo $row['end_time']; ?></td>
            <td><?php echo $row['status']; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <p>Bedankt om geregeld de beschikbaarheden in te vullen.</p>
    <p>Running On Empty<br>
    <a href="http://www.runningonempty.be">www.runningonempty.be</a></p>
</body>
</html>

<?php
$email_body = ob_get_clean();

// Send the email
$mail = new PHPMailer;
$mail->isSMTP();
$mail->Host = 'smtp.yourserver.com';
$mail->SMTPAuth = true;
$mail->Username = 'noreply@yourdomain.com';
$mail->Password = 'yourpassword';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('noreply@yourdomain.com', 'Running On Empty');
$mail->addAddress('recipient@example.com'); // Add your recipients here

$mail->isHTML(true);
$mail->Subject = 'Weekly Availability';
$mail->Body    = $email_body;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
?>
