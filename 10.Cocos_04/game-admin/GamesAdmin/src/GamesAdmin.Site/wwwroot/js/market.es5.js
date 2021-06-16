"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Market = (function () {
    function Market() {
        _classCallCheck(this, Market);
    }

    _createClass(Market, [{
        key: "showMarketForm",
        value: function showMarketForm(marketName) {
            $.ajax({
                method: "GET",
                url: "/market/" + marketName
            }).done(function (content) {
                if (content) {
                    $('#marketDetails').html(content);
                    $('#marketTitleName').html(marketName);
                    $('#marketModal').modal('show');

                    $('.btn-submit').on('click', function () {
                        market.onSubmit();
                    });
                }
            });
        }
    }, {
        key: "showMarketRateForm",
        value: function showMarketRateForm(marketName) {
            $.ajax({
                method: "GET",
                url: "/market/EditRate/" + marketName
            }).done(function (content) {
                if (content) {
                    $('#marketDetails').html(content);
                    $('#marketTitleName').html(marketName);
                    $('#marketModal').modal('show');

                    $('.btn-submit').on('click', function () {
                        market.onSubmitRate();
                    });
                }
            });
        }
    }, {
        key: "onSubmitRate",
        value: function onSubmitRate() {
            var modal = $('#marketModal');
            modal.find('#updateBtn').prop('disabled', true);

            $.ajax({
                method: "POST",
                url: "/market/EditRate",
                dataType: 'json',
                data: $('#marketForm').serialize()
            }).done(function (result) {
                if (result.success) {
                    modal.find('#failedMsg').hide();
                    modal.find('#successMsg').show();

                    setTimeout(function () {
                        modal.find('#updateBtn').prop('disabled', false);
                        modal.modal('hide');
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
        key: "onSubmit",
        value: function onSubmit() {
            if ($('#Name').val() == "") {
                $('#failedMsg').show();
                $('#Name').focus();
                $('#failedMsg').html('Market name is required.');
                return;
            } else if ($('#Currencies').val() == "") {
                $('#failedMsg').show();
                $('#Currencies').focus();
                $('#failedMsg').html('Currency is required.');
                return;
            } else {
                $('#failedMsg').hide();
            }

            $.ajax({
                method: "POST",
                url: "/market/update",
                dataType: 'json',
                data: $('#marketForm').serialize()
            }).done(function (result) {
                if (result) {
                    $('#successMsg').show();
                } else {
                    $('#failedMsg').show();
                }

                setTimeout(function () {
                    $('#marketModal').modal('hide');
                    location.reload();
                }, 1000);
            });
        }
    }, {
        key: "onChangeBase",
        value: function onChangeBase() {
            var isBase = $("#IsBase").prop("checked");

            if (isBase) {
                $("#Rate").val(1);
            }

            $("#Rate").prop("disabled", isBase);
        }
    }, {
        key: "updateStatus",
        value: function updateStatus(name, enabled) {
            $.ajax({
                method: "POST",
                url: "/market/updatestatus",
                dataType: 'json',
                data: {
                    name: name,
                    enabled: enabled
                }
            }).done(function (result) {
                if (result) {
                    $('#updateStatusSuccess').show();
                } else {
                    $('#updateStatusFailed').show();
                }

                setTimeout(function () {
                    location.reload();
                }, 1000);
            });
        }
    }, {
        key: "init",
        value: function init() {
            $('.btn-edit').on('click', function () {
                var marketName = $(this).attr('market-name');

                market.showMarketForm(marketName);
            });

            $('.btn-edit-rate').on('click', function () {
                var marketName = $(this).attr('market-name');

                market.showMarketRateForm(marketName);
            });

            $('.market-status-chk').on('change', function () {
                var name = $(this).attr('market-name');
                var status = $(this).is(":checked");

                market.updateStatus(name, status);
            });
        }
    }]);

    return Market;
})();

var market = new Market();
market.init();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

