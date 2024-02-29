<?php
include('config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $imagePath = '';
    if (!empty($_FILES['image']['name'])) {
        $image = $_FILES['image'];

        if ($image['size'] > 1000000) {
            echo json_encode(array('error' => 'Ошибка: Файл слишком большой!'));
            exit();
        } elseif (!in_array($image['type'], ['image/jpeg', 'image/png', 'image/gif'])) {
            echo json_encode(array('error' => 'Ошибка: Недопустимый формат изображения!'));
            exit();
        } else {
            $imageName = str_replace(' ', '_', $image['name']);
            $imagePath = 'uploads/' . basename($imageName);

            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }
            if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
                echo json_encode(array('error' => 'Ошибка при перемещении файла!'));
                exit();
            }
        }
    }

    $sql = "INSERT INTO feedbacks (name, email, message, image) VALUES ('$name', '$email', '$message', '$imagePath')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('success' => 'Отзыв успешно отправлен!'));
    } else {
        echo json_encode(array('error' => 'Ошибка при добавлении отзыва: ' . $conn->error));
    }
}
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $isAdmin = isset($_GET['admin']) && $_GET['admin'] === 'true';
    $sortField = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';

    
        $sql = "SELECT * FROM feedbacks WHERE status='approved' ORDER BY $sortField DESC";
        $result = $conn->query($sql);

        if ($result !== FALSE) {
            if ($result->num_rows > 0) {
                $feedbacks = array();
                while ($row = $result->fetch_assoc()) {
                    $feedbacks[] = $row;
                }
                echo json_encode($feedbacks);
            } else {
                echo json_encode(array('error' => 'Нет отзывов'));
            }
        } else {
            echo json_encode(array('error' => 'Ошибка при загрузке отзывов: ' . $conn->error));
        }
    
    $conn->close();
}
