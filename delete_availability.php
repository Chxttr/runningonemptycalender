<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die("Unauthorized");
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "availability";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$id = $_POST['id'];
$user_id = $_SESSION['user_id'];
$isForced = $_POST['isForced'];

if ($isForced) {
    $sql = "DELETE FROM availabilities WHERE id='$id'";
} else {
    $sql = "DELETE FROM availabilities WHERE id='$id' AND user_id='$user_id'";
}

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
