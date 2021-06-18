﻿class ChipConfig {

    showEditModal(name) { 
        const modal = $('#editModal');
        if (!name) {
            name = "";
        }

        $.ajax({
            method: "GET",
            url: "/chipconfig/edit?name=" + name
        }).done(function (content) {                        
            if (content) {
                modal.find('#editdetails').html(content);
                //$('#currencyName').html(currency);
                modal.modal('show');
            }
        });
    }

    submitEdit() {
        const modal = $('#editModal');

        modal.find('#updateBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/chipconfig/edit",
            dataType: 'json',
            data: modal.find('#editForm').serialize(),
        }).done(function (result) {
            if (result.success) {
                modal.find('#failedMsg').hide();
                modal.find('#successMsg').show();

                setTimeout(function () {
                    modal.find('#updateBtn').prop('disabled', false);
                    modal.find('#gameModal').modal('hide');
                    location.reload();
                }, 1000);
            }
            else {
                modal.find('#failedMsg').show();

                modal.find('#failedMsgContent').html(result.message);
                modal.find('#updateBtn').prop('disabled', false);
            }
        });
    }
}

var chipConfig = new ChipConfig();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);