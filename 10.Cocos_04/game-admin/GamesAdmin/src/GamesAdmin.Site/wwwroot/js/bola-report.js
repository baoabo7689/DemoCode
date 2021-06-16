class BolaReport {
    showConfig(currency, stake, tableIndex) {
        const modal = $('#configModal');

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

    showEnableDisable(isEnabled, tableIndex) {
        let enabled = !(isEnabled == "True")
        let txt = enabled ? "Enable" : "Disable";

        const modal = $('#enableModal');
        modal.find("#enableParam").val(enabled);
        modal.find("#tableIndexParam").val(tableIndex);        
        modal.find('#reloadContent').html(`Are you sure you want ${txt} Table Index ${tableIndex}`);
        modal.modal('show');
    }

    submitEnableDisable() {
        const modal = $('#enableModal');
        let enableParam = modal.find("#enableParam").val();
        let tableIndexParam = parseInt(modal.find("#tableIndexParam").val());
        modal.find('#confirmBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/bolareport/enabledisable?enabled=" + enableParam + "&tableIndex=" + tableIndexParam
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

                //bolaConfig.loadReport();
            }, 1000);
        });
    }

    cancelEnableDisable() {
        const modal = $('#enableModal');
        modal.modal('hide');
        bolaReport.loadReport();
    }

    loadReport() {
        const bolaForm = $('#bolaReportForm');
        bolaForm.submit();
    }
}

var bolaReport = new BolaReport();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    //bolaReport.loadReport();
});
