<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "availability";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$month = $_GET['month'];
$year = $_GET['year'];

$sql = "SELECT availabilities.id, date, start_time, end_time, status, user_id, users.username AS name, activities.name AS activity_name
        FROM availabilities
        JOIN users ON availabilities.user_id = users.id
        LEFT JOIN activities ON availabilities.activity_id = activities.id
        WHERE MONTH(date) = '$month' AND YEAR(date) = '$year'";

$result = $conn->query($sql);

$availabilities = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $availabilities[] = $row;
    }
}

echo json_encode($availabilities);

$conn->close();
?>
