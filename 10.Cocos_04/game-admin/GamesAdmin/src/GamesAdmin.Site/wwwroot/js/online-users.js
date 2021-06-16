var onlineUsers = (function ($) {
    return {
        init: function () {
            $('#online-users-table').DataTable({
                "order": [[1, "asc"]],
                "pageLength": 50
            });
        }
    }
}(jQuery));

$(document).ready(function () {
    onlineUsers.init();
});