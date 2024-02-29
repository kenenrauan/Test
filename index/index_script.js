$(document).ready(function() {
    $('#feedback-form').submit(function(e) {
        e.preventDefault();

        var formData = new FormData(this);

        $.ajax({
            type: 'POST',
            url: 'index_backend.php',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.error) {
                    $('#error-message').html(response.error);
                } else {
                    $('#error-message').html('');
                }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                $('#error-message').html(JSON.parse(xhr.responseText).error);
            }
        });
    });

    loadFeedbacks();

    $('#sort-field').change(function() {
        loadFeedbacks();
    });

    function loadFeedbacks() {
        var sortField = $('#sort-field').val();
        
        $.ajax({
            type: 'GET',
            url: 'index_backend.php',
            data: {
                sort: sortField,
            },
            dataType: 'json',
            success: function(response) {
                if (response.error) {
                    $('#error-message').html(response.error);
                } else {
                    $('#feedback-list').html('');
                    $.each(response, function(index, feedback) {
                        var html = "<div class='feedback'>";
                        html += "<p>Имя: " + feedback.name + "</p>";
                        html += "<p>E-mail: " + feedback.email + "</p>";
                        html += "<p>Сообщение: " + feedback.message + "</p>";
        
                        if (feedback.modified_by_admin == 1) {
                            html += " (изменен администратором)";
                        }
                        if (feedback.image) {
                            html += "<img src='" + feedback.image + "'><br>";
                        }
    
                        html += "</div>";
                        $('#feedback-list').append(html);
                    });
                }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                $('#error-message').html(JSON.parse(xhr.responseText).error);
            }
        });
    }

    setInterval(loadFeedbacks, 1000);
});
