"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BolaConfig = (function () {
    function BolaConfig() {
        _classCallCheck(this, BolaConfig);
    }

    _createClass(BolaConfig, [{
        key: "showEditModal",
        value: function showEditModal(currency) {
            var modal = $('#editModal');

            $.ajax({
                method: "GET",
                url: "/bolaconfig/edit?currency=" + currency
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

            modal.find('#updateBtn').prop('disabled', true);
            $.ajax({
                method: "POST",
                url: "/bolaconfig/edit",
                dataType: 'json',
                data: modal.find('#editForm').serialize()
            }).done(function (result) {
                if (result) {
                    modal.find('#successMsg').show();
                } else {
                    modal.find('#failedMsg').show();
                }

                setTimeout(function () {
                    modal.find('#updateBtn').prop('disabled', false);
                    modal.modal('hide');
                    //location.reload();

                    bolaConfig.loadReport();
                }, 1000);
            });
        }
    }, {
        key: "showEditAmount",
        value: function showEditAmount(currency, amount) {
            var modal = $('#editAmountModal');

            $.ajax({
                method: "GET",
                url: "/bolaconfig/editamount?currency=" + currency + "&amount=" + amount
            }).done(function (content) {
                if (content) {
                    modal.find('#editdetails').html(content);
                    //$('#currencyName').html(currency);
                    modal.modal('show');
                }
            });
        }
    }, {
        key: "submitEditAmount",
        value: function submitEditAmount() {
            var modal = $('#editAmountModal');

            modal.find('#updateBtn').prop('disabled', true);
            $.ajax({
                method: "POST",
                url: "/bolaconfig/editamount",
                dataType: 'json',
                data: modal.find('#editForm').serialize()
            }).done(function (result) {
                if (result) {
                    modal.find('#successMsg').show();

                    setTimeout(function () {
                        modal.find('#updateBtn').prop('disabled', false);
                        modal.modal('hide');
                        //location.reload();
                    }, 1000);
                } else {
                    modal.find('#failedMsg').show();
                    modal.find('#updateBtn').prop('disabled', false);

                    setTimeout(function () {
                        modal.find('#failedMsg').hide();
                        //modal.modal('hide');
                        //location.reload();
                    }, 2000);
                }
            });
        }
    }, {
        key: "showLoad",
        value: function showLoad() {
            var modal = $('#reloadModal');
            modal.find('#reloadContent').html("Are you sure you want to Load new Config?");
            modal.modal('show');
        }
    }, {
        key: "submitLoad",
        value: function submitLoad() {
            var modal = $('#reloadModal');

            modal.find('#confirmBtn').prop('disabled', true);
            $.ajax({
                method: "POST",
                url: "/bolaconfig/loadnew"
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

                    bolaConfig.loadReport();
                }, 1000);
            });
        }
    }, {
        key: "loadReport",
        value: function loadReport() {
            var bolaForm = $('#bolaConfigForm');
            bolaForm.submit();
        }
    }]);

    return BolaConfig;
})();

var bolaConfig = new BolaConfig();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    bolaConfig.loadReport();
});

