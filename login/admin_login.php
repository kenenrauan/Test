<?php
include('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username === "admin" && $password === "123") {
        echo "Авторизация успешна";
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Неверные учетные данные"]);
    }
}

$conn->close();
?>
