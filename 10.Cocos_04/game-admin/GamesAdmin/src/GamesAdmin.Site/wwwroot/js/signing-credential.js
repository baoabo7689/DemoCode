class SigningCredential {
    createNewKey() {
        $.ajax({
            method: "POST",
            url: "/SigningCredential/CreateNew",
            dataType: 'json',
        })
            .done(() => location.reload())
            .fail(() => location.reload());
    }

    generateNewKey(keyId, isMain) {
        $.ajax({
            method: "POST",
            url: `/SigningCredential/Generate`,
            dataType: 'json',
            data: { keyId, isMain }
        })
            .done(() => location.reload())
            .fail(() => location.reload());
    }

    updateKeyStatus(keyId, isMain) {
        $.ajax({
            method: "POST",
            url: `/SigningCredential/ChangeStatus`,
            dataType: 'json',
            data: { keyId, isMain }
        })
            .done(() => location.reload())
            .fail(() => location.reload());
    }

    registerEvents() {
        $('.is-main').change(function () {
            var checkBox = $(this);
            var checked = checkBox.is(':checked');
            var keyId = checkBox.data('keyId');

            signingCredential.updateKeyStatus(keyId.trim(), checked);
        })
    }
}

var signingCredential = new SigningCredential();

$(document).ready(function () {
    signingCredential.registerEvents();
});