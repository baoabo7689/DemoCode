"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Announcement = (function () {
    function Announcement() {
        _classCallCheck(this, Announcement);
    }

    _createClass(Announcement, [{
        key: "showEnableDisable",
        value: function showEnableDisable(isEnabled, id, title) {
            var enabled = !(isEnabled == "True");
            var txt = enabled ? "enable" : "disable";

            var modal = $('#enableModal');
            modal.find("#enableParam").val(enabled);
            modal.find("#tableIndexParam").val(id);
            modal.find('#reloadContent').html("Are you sure you want to " + txt + " announcement <b>" + title + "</b>");
            modal.modal('show');
        }
    }, {
        key: "submitEnableDisable",
        value: function submitEnableDisable() {
            var modal = $('#enableModal');
            var enableParam = modal.find("#enableParam").val();
            var tableIndexParam = modal.find("#tableIndexParam").val();
            modal.find('#confirmBtn').prop('disabled', true);
            $.ajax({
                method: "PUT",
                url: "/announcement/UpdateStatus",
                dataType: 'json',
                data: {
                    Status: enableParam,
                    Id: tableIndexParam
                }
            }).done(function (updated) {
                if (updated) {
                    modal.find('#updateMsgSuccess').show();
                } else {
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
    }, {
        key: "cancelEnableDisable",
        value: function cancelEnableDisable() {
            var modal = $('#enableModal');
            modal.modal('hide');
            announcementReport.loadReport();
        }
    }, {
        key: "showEditModal",
        value: function showEditModal(id) {
            var modal = $('#editModal');
            var modalHeader = modal.find('#announcementModalTitle');

            modalHeader.html(id ? "Edit Announcement" : "Add New Announcement");

            if (!name) {
                name = "";
            }

            $.ajax({
                method: "GET",
                url: "/announcement/edit" + (id ? "?id=" + id : "")
            }).done(function (content) {
                if (content) {
                    modal.find('#editdetails').html(content);
                    //$('#currencyName').html(currency);
                    modal.modal('show');
                }
            });
        }
    }, {
        key: "submitEdit",
        value: function submitEdit() {
            var modal = $('#editModal');

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
                data: modal.find('#editForm').serialize()
            }).done(function (result) {
                if (result.success) {
                    modal.find('#failedMsg').hide();
                    modal.find('#successMsg').show();

                    setTimeout(function () {
                        modal.find('#updateBtn').prop('disabled', false);
                        modal.find('#gameModal').modal('hide');
                        location.reload();
                    }, 1000);
                } else {
                    modal.find('#failedMsg').show();

                    modal.find('#failedMsgContent').html(result.message);
                    modal.find('#updateBtn').prop('disabled', false);
                }
            });
        }
    }, {
        key: "loadReport",
        value: function loadReport() {
            $('#reportForm').submit();
        }
    }]);

    return Announcement;
})();

var announcementReport = new Announcement();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    announcementReport.loadReport();
});

