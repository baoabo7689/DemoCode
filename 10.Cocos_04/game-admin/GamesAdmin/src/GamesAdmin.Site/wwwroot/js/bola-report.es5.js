"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BolaReport = (function () {
    function BolaReport() {
        _classCallCheck(this, BolaReport);
    }

    _createClass(BolaReport, [{
        key: "showConfig",
        value: function showConfig(currency, stake, tableIndex) {
            var modal = $('#configModal');

            $.ajax({
                method: "GET",
                url: "/bolareport/config?currency=" + currency + "&stake=" + stake + "&tableIndex=" + tableIndex
            }).done(function (content) {
                if (content) {
                    modal.find('#editdetails').html(content);
                    modal.modal('show');
                }
            });
        }
    }, {
        key: "showEnableDisable",
        value: function showEnableDisable(isEnabled, tableIndex) {
            var enabled = !(isEnabled == "True");
            var txt = enabled ? "Enable" : "Disable";

            var modal = $('#enableModal');
            modal.find("#enableParam").val(enabled);
            modal.find("#tableIndexParam").val(tableIndex);
            modal.find('#reloadContent').html("Are you sure you want " + txt + " Table Index " + tableIndex);
            modal.modal('show');
        }
    }, {
        key: "submitEnableDisable",
        value: function submitEnableDisable() {
            var modal = $('#enableModal');
            var enableParam = modal.find("#enableParam").val();
            var tableIndexParam = parseInt(modal.find("#tableIndexParam").val());
            modal.find('#confirmBtn').prop('disabled', true);
            $.ajax({
                method: "POST",
                url: "/bolareport/enabledisable?enabled=" + enableParam + "&tableIndex=" + tableIndexParam
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

                    //bolaConfig.loadReport();
                }, 1000);
            });
        }
    }, {
        key: "cancelEnableDisable",
        value: function cancelEnableDisable() {
            var modal = $('#enableModal');
            modal.modal('hide');
            bolaReport.loadReport();
        }
    }, {
        key: "loadReport",
        value: function loadReport() {
            var bolaForm = $('#bolaReportForm');
            bolaForm.submit();
        }
    }]);

    return BolaReport;
})();

var bolaReport = new BolaReport();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    //bolaReport.loadReport();
});

