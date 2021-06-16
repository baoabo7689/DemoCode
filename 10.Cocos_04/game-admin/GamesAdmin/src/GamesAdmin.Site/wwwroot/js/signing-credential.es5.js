"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SigningCredential = (function () {
    function SigningCredential() {
        _classCallCheck(this, SigningCredential);
    }

    _createClass(SigningCredential, [{
        key: "createNewKey",
        value: function createNewKey() {
            $.ajax({
                method: "POST",
                url: "/SigningCredential/CreateNew",
                dataType: 'json'
            }).done(function () {
                return location.reload();
            }).fail(function () {
                return location.reload();
            });
        }
    }, {
        key: "generateNewKey",
        value: function generateNewKey(keyId, isMain) {
            $.ajax({
                method: "POST",
                url: "/SigningCredential/Generate?KeyId=" + keyId.trim() + "&IsMain=" + isMain,
                dataType: 'json'
            }).done(function () {
                return location.reload();
            }).fail(function () {
                return location.reload();
            });
        }
    }, {
        key: "updateKeyStatus",
        value: function updateKeyStatus(keyId, isMain) {
            $.ajax({
                method: "POST",
                url: "/SigningCredential/ChangeStatus?KeyId=" + keyId.trim() + "&IsMain=" + isMain,
                dataType: 'json'
            }).done(function () {
                return location.reload();
            }).fail(function () {
                return location.reload();
            });
        }
    }, {
        key: "registerEvents",
        value: function registerEvents() {
            $('.is-main').change(function () {
                var checkBox = $(this);
                var checked = checkBox.is(':checked');
                var keyId = checkBox.data('keyId');

                signingCredential.updateKeyStatus(keyId.trim(), checked);
            });
        }
    }]);

    return SigningCredential;
})();

var signingCredential = new SigningCredential();

$(document).ready(function () {
    signingCredential.registerEvents();
});

