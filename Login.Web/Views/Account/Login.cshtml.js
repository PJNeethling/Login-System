(function () {

    'use strict';

    $(function () {
        accountLogin.initialize();
    });

}).apply(this, [jQuery]);

var accountLogin = {

    controllerName: "",

    initialize: function () {
        this.controllerName = "Account";
        this.events();
    },

    events: function () {
        var _self = this;

        $(document).ready(function () {
            /* Login User */
            $('.login-form-container form').on('submit', function (e) {
                e.preventDefault();

                var model = {
                    UserName: $('[name=username]').val(),
                    Password: $('[name=password]').val(),
                    Persist: $('[name=persist]').is(':checked')
                }

                _self.login(model);
            });
            /* Recover User */
            $('.recover-form-container form').on('submit', function (e) {
                e.preventDefault();

                var model = {
                    UserName: $('[name=username]').val()
                }

                _self.recover(model);
            });
            $('form input').on('change', function (e) {
                if (!$('.alert-success').hasClass('hidden'))
                    $('.alert-success').addClass('hidden');
                if (!$('.alert-danger').hasClass('hidden'))
                    $('.alert-danger').addClass('hidden');
                if ($('.form-group').hasClass('has-error'))
                    $('.form-group').removeClass('has-error');
            });
        });
    },

    login: function (model) {
        var _self = this;

        Layout.MVC.post(null, _self.controllerName, "LoginUser", model, {
            success: function (result) {
                if (result.success == true) {
                    $('.alert-success').removeClass('hidden');

                    window.location.href = result.returnUrl;
                }
                else {
                    $('.alert-danger').find('strong').text(result.message);
                    $('.alert-danger').removeClass('hidden');
                }
            }
        });
    },

    recover: function (model) {
        var _self = this;

        Layout.MVC.post(null, _self.controllerName, "RecoverUser", model, {
            success: function (result) {
                if (result.success == true) {
                    $('.alert-success').removeClass('hidden');
                }
            }
        });
    }
}
