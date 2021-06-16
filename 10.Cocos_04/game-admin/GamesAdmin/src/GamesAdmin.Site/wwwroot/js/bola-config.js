class BolaConfig {

    showEditModal(currency) { 
        const modal = $('#editModal');

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

    submitEdit() {
        const modal = $('#editModal');

        modal.find('#updateBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/bolaconfig/edit",
            dataType: 'json',
            data: modal.find('#editForm').serialize(),
        }).done(function (result) {
            if (result) {
                modal.find('#successMsg').show();
            }
            else {
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

    showEditAmount(currency, amount) {
        const modal = $('#editAmountModal');

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

    submitEditAmount() {
        const modal = $('#editAmountModal');

        modal.find('#updateBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/bolaconfig/editamount",
            dataType: 'json',
            data: modal.find('#editForm').serialize(),
        }).done(function (result) {
            if (result) {
                modal.find('#successMsg').show();

                setTimeout(function () {
                    modal.find('#updateBtn').prop('disabled', false);
                    modal.modal('hide');
                    //location.reload();
                }, 1000);
            }
            else {
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

    showLoad() {
        const modal = $('#reloadModal');
        modal.find('#reloadContent').html("Are you sure you want to Load new Config?");
        modal.modal('show');
    }

    submitLoad() {
        const modal = $('#reloadModal');

        modal.find('#confirmBtn').prop('disabled', true);
        $.ajax({
            method: "POST",
            url: "/bolaconfig/loadnew"
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

                bolaConfig.loadReport();
            }, 1000);
        });
    }

    loadReport() {
        const bolaForm = $('#bolaConfigForm');
        bolaForm.submit();
    }
}

var bolaConfig = new BolaConfig();
stickHeader.stick('.inner-content', 'table#report-table', 120, -20);

$(document).ready(function () {
    bolaConfig.loadReport();
});
