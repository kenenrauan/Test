<?php
include('config.php');

$response = array();


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];
    $id = $_POST['id'];

    if ($action == 'approve') {
        $sql = "UPDATE feedbacks SET status='approved' WHERE id=$id";
    } elseif ($action == 'reject') {
        $sql = "UPDATE feedbacks SET status='rejected' WHERE id=$id";
    } elseif ($action == 'edit') {
        $newMessage = $_POST['message'];
        $sql = "UPDATE feedbacks SET message='$newMessage', modified_by_admin=1 WHERE id=$id";
    }

    if ($conn->query($sql) === TRUE) {
        $response['success'] = "Отзыв успешно обработан!";
    } else {
        $response['error'] = "Ошибка при обработке отзыва: " . $conn->error;
    }

    echo json_encode($response);
}else {
    $sql = "SELECT * FROM feedbacks WHERE status='pending' ORDER BY id DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $feedbacks = array();
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = $row;
        }
        echo json_encode($feedbacks);
    } else {
        echo json_encode(["message" => "Нет отзывов для модерации"]);
    }
}

$conn->close();
?>
