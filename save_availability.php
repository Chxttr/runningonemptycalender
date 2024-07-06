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

$date = $_POST['date'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];
$status = $_POST['status'];
$activity_id = isset($_POST['activity']) ? $_POST['activity'] : NULL;
$user_id = $_SESSION['user_id'];

$sql = "INSERT INTO availabilities (date, start_time, end_time, status, user_id, activity_id) VALUES ('$date', '$start_time', '$end_time', '$status', '$user_id', '$activity_id')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
