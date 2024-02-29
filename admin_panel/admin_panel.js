$(document).ready(function() {
    loadPendingFeedbacks();

    function loadPendingFeedbacks() {
        $.ajax({
            type: 'GET',
            url: 'admin_panel.php',
            dataType: 'json',
        }).done(function(response) {
            if (response.error) {
                $('#admin-feedback-list').html('Ошибка: ' + response.error);
            } else if (response.message) {
                $('#admin-feedback-list').html(response.message);
            } else {
                $('#admin-feedback-list').html('');
                displayFeedbacks(response); 
            }
        }).fail(function(error) {
            $('#admin-feedback-list').html('Ошибка: ' + error.responseJSON.error);
        });
    }

    function displayFeedbacks(feedbacks) {
        $.each(feedbacks, function(index, feedback) {
            var html = "<div class='admin-feedback'>";
            html += "<p>Имя: " + feedback.name + "</p>";
            html += "<p>E-mail: " + feedback.email + "</p>";
            html += "<p>Сообщение: " + feedback.message + "</p>";
            
            if (feedback.image) {
                html += "<img class='thumbnail' src='" + feedback.image + "' alt='Thumbnail'><br>";
            }

            html += "<button data-id='" + feedback.id + "' data-action='approve'>Принять</button>";
            html += "<button data-id='" + feedback.id + "' data-action='reject'>Отклонить</button>";
            html += "<button data-id='" + feedback.id + "' data-action='edit'>Редактировать</button>";
            html += "</div>";
            $('#admin-feedback-list').append(html);
        });
    }

    $('#admin-feedback-list').on('click', 'button', function() {
        var feedbackId = $(this).data('id');
        var action = $(this).data('action');

        if (action === 'edit') {
            var newMessage = prompt("Введите новый текст сообщения:", "");
            if (newMessage !== null) {
                editFeedback(feedbackId, newMessage);
            }
        } else {
            processFeedback(feedbackId, action);
        }
    });

    function processFeedback(feedbackId, action) {
        $.ajax({
            type: 'POST',
            url: 'admin_panel.php',
            data: { action: action, id: feedbackId },
            dataType: 'json',
        }).done(function(response) {
            if (response.error) {
                console.log('Ошибка: ' + response.error);
            } else {
                console.log('Отзыв ' + action);
                loadPendingFeedbacks();
            }
        }).fail(function(error) {
            console.log('Ошибка: ' + error.responseJSON.error);
        });
    }

    function editFeedback(feedbackId, newMessage) {
        $.ajax({
            type: 'POST',
            url: 'admin_panel.php',
            data: { action: 'edit', id: feedbackId, message: newMessage },
            dataType: 'json',
        }).done(function(response) {
            if (response.error) {
                console.log('Ошибка: ' + response.error);
            } else {
                console.log('Отзыв изменен');
                loadPendingFeedbacks();
            }
        }).fail(function(error) {
            console.log('Ошибка: ' + error.responseJSON.error);
        });
    }

    setInterval(loadPendingFeedbacks, 1000);
});
