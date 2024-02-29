<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "feedback_db";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "ALTER TABLE feedbacks ADD COLUMN modified_by_admin BOOLEAN DEFAULT 0";
$conn->query($sql);

?>
