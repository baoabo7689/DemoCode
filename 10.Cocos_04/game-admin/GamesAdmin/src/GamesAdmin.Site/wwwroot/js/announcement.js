class Announcement {
    showEnableDisable(isEnabled, id, title) {
        let enabled = !(isEnabled == "True")
        let txt = enabled ? "enable" : "disable";

        const modal = $('#enableModal');
        modal.find("#enableParam").val(enabled);
        modal.find("#tableIndexParam").val(id);
        modal.find('#reloadContent').html(`Are you sure you want to ${txt} announcement <b>${title}</b>`);
        modal.modal('show');
    }

    submitEnableDisable() {
        const modal = $('#enableModal');
        let enableParam = modal.find("#enableParam").val();
        let tableIndexParam = modal.find("#tableIndexParam").val();
        modal.find('#confirmBtn').prop('disabled', true);
        $.ajax({
            method: "PUT",
            url: "/announcement/UpdateStatus",
            dataType: 'json',
            data: {
                Status: enableParam,
                Id: tableIndexParam
            },
        }).done(function (updated) {
            if (updated) {
                modal.find('#updateMsgSuccess').show();
            }
            else {
                modal.find('#updateMsgFailed').show();
            }

            setTimeout(function () {
                modal.find('#confirmBtn').prop('disabled', false);
                modal.find('#updateMsgSuccess').hide();
                modal.find('#updateMsgFailed').hide();
                modal.modal('hide');
            }, 1000);
        });
    }

    cancelEnableDisable() {
        const modal = $('#enableModal');
        modal.modal('hide');
        announcementReport.loadReport();
    }

    showEditModal(id) {
        const modal = $('#editModal');
        const modalHeader = modal.find('#announcementModalTitle');

        modalHeader.html(id ? "Edit Announcement" : "Add New Announcement");

        if (!name) {
            name = "";
        }

        $.ajax({
            method: "GET",
            url: "/announcement/edit" + (id ? `?id=${id}` : "")
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

        if ($('#Data_Title').val() == "") {
            $('#failedMsg').show();
            $('#Data_Title').focus();
            $('#failedMsg').html('Title is required.');
            return;
        }

        if ($('#Data_Contents_en_').val() == "") {
            $('#failedMsg').show();
            $('#Data_Title').focus();
            $('#failedMsg').html('English content is required.');
            return;
        }

        modal.find('#updateBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/announcement/edit",
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

    loadReport() {
        $('#reportForm').submit();
    }
}

var announcementReport = new Announcement();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    announcementReport.loadReport();
});
