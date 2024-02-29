$(document).ready(function() {
    $('#admin-login-form').submit(function(e) {
        e.preventDefault();

        var formData = $(this).serialize();

        $.ajax({
            type: 'POST',
            url: 'admin_login.php',
            data: formData,
            success: function(response) {
                alert(response);
                if (response === "Авторизация успешна") {
                    window.location.replace("admin_panel.html");
                }
            },
            error: function(error) {
                $('#admin-error-message').html('Ошибка: ' + error.responseJSON.error);
            }
        });
    });
});
