(function() {

    'use strict';

    $(function() {
        Layout.initialize();
    });

}).apply(this, [jQuery]);

var Layout = {

    initialize: function() {
        this
            .build()
            .events();
    },

    build: function() {
        this.initSite();
        this.initMessenger();
        return this;
    },

    events: function() {

        var _self = this;

        /* Document ready */
        $(document).ready(function() {

        });

    },

    initSite: function() {
        Site.run();
    },

    initMessenger: function() {
        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
            theme: 'air'
        }
    },

    initDataTables: function() {
        // initialize all dataTables that are not initialized yet
        $("table.table").each(function(index) {
            if (!$.fn.DataTable.isDataTable(this)) {
                var $dataTable = $(this);
                $dataTable.dataTable({
                    aLengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
                    iDisplayLength: 50,
                    autoWidth: false,
                    aaSorting: [],
                    ordering: false
                });

                // remove the loader graphic
                var $tableContainer = $dataTable.parents().closest('div.table-container');
                $tableContainer.find('div.loader').remove();

                // show the table
                $dataTable.show();

                // set focus on the search box
                $dataTable.closest('.dataTables_wrapper').find('input[type=search]').focus();
            }
        });
    }
};

Layout.InfoMessage = {
    Show: function(title, result) {
        if (result == null || String.IsNullOrEmpty(result.message))
            return;

        Messenger().post({
            message: result.message,
            type: result.success == null ? 'info' : result.success == true ? 'info' : 'error',
            showCloseButton: true
        })
    }
};

Layout.Notification = {
    Show: function(message) {
        if (!String.IsNullOrEmpty(message))
            Messenger().post({
                message: message,
                type: "info",
                showCloseButton: true
            });
    }
}

Layout.ErrorDialog = {
    Show: function(title, error) {
        var jsonResponse = JSON.parse(error.responseText);
        var message = jsonResponse.message;

        bootbox.dialog({
            title: title,
            message: message,
            buttons: {
                danger: {
                    label: "OK",
                    className: "btn-danger"
                }
            }
        });
    }
};

Layout.ConfirmationDialog = {
    // Show Dialog
    Show: function(title, message, buttonLabel, buttonClass, callbacks) {
        bootbox.dialog({
            title: title,
            message: message,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn",
                    callback: function() {
                        $(this).hide();
                    }
                },
                success: {
                    label: buttonLabel,
                    className: buttonClass,
                    callback: function(e) {
                        e.preventDefault();
                        if (callbacks != null && typeof callbacks.success === 'function') {
                            callbacks.success(e);
                        }
                    }
                }
            }
        });
    }
};

Layout.CustomDialog = {
    // Show Dialog
    Show: function(title, message, modalClass, buttonLabel, buttonClass, callbacks) {
        bootbox.dialog({
            title: title,
            message: message,
            className: modalClass,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: function() {
                        $(this).hide();
                    }
                },
                success: {
                    label: buttonLabel,
                    className: buttonClass,
                    callback: function(e) {
                        e.preventDefault();
                        if (callbacks != null && typeof callbacks.success === 'function') {
                            callbacks.success(e);
                        }
                    }
                }
            }
        });
    }
};

Layout.UI = {

    Section: function($section) {

        return {
            DataTable: function() {
                return {
                    events: function(callbacks) {

                        $section.find('button.btn-primary').click(function(e) {
                            e.preventDefault();

                            if (callbacks != null && typeof callbacks.new === 'function') {
                                callbacks.new(this, e);
                            }
                        });

                        $section.on('click', 'table.table > tbody > tr > td:first-child, table.table > tbody > tr > td.view', function(e) {
                            e.preventDefault();

                            var $row = $(this).parent();
                            var id = $row.attr("data-id");
                            var guid = $row.attr("data-guid");
                            if (id === undefined && guid === undefined)
                                return;

                            if (callbacks != null && typeof callbacks.view === 'function') {
                                callbacks.view($row, e);
                            }
                        });

                        $section.on('click', 'table.table > tbody > tr > td > button.btn-danger', function(e) {
                            e.preventDefault();

                            var $row = $(this).parent().parent();
                            var id = $row.attr("data-id");
                            var guid = $row.attr("data-guid");
                            if (id === undefined && guid === undefined)
                                return;

                            if (callbacks != null && typeof callbacks.delete === 'function') {
                                callbacks.delete($row, e);
                            }
                        });

                        $section.on('click', 'table.table > tbody > tr > td.actions > a', function(e) {
                            e.preventDefault();

                            var $row = $(this).parent().parent();
                            var id = $row.attr("data-id");
                            var guid = $row.attr("data-guid");
                            if (id === undefined && guid === undefined)
                                return;

                            e.action = $(this).attr('href');

                            if (callbacks != null && typeof callbacks.action === 'function') {
                                callbacks.action($row, e);
                            }
                        });
                    }
                }
            }
        };
    },

    Form: function(formName) {
        this.Name = formName;
        return {
            events: function(callbacks) {
                $('form.' + formName + ' footer button.btn-primary').click(function(e) {
                    e.preventDefault();

                    if (callbacks != null && typeof callbacks.update === 'function') {
                        callbacks.update(this, e);
                    }
                });
            }
        }
    }
};

Layout.MVC = {

    // gets data and execute callbacks
    get: function(areaName, controllerName, viewName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + viewName;
        else
            url = '/' + controllerName + '/' + viewName;

        // ajax load
        $.ajax({
            method: "GET",
            url: url,
            cache: false,
            dataType: 'json',
            data: model,
            success: function(result) {
                if (callbacks != null && typeof callbacks.success === 'function') {
                    callbacks.success(result);
                }
            },
            error: function(error) {
                Layout.ErrorDialog.Show('Load failed', error);
                if (callbacks != null && typeof callbacks.error === 'function') {
                    callbacks.error(error);
                }
            }
        });
    },

    // set action
    set: function(areaName, controllerName, actionName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + viewName;
        else
            url = '/' + controllerName + '/' + viewName;

        // ajax post
        $.ajax({
            method: 'SET',
            url: url,
            dataType: 'json',
            data: model,
            success: function(result) {
                if (callbacks != null && typeof callbacks.success === 'function') {
                    callbacks.success(result);
                }
            },
            error: function(error) {
                Layout.ErrorDialog.Show('Failed', error);
                if (callbacks != null && typeof callbacks.error === 'function') {
                    callbacks.error(error);
                }
            }
        });
    },

    // post action
    post: function(areaName, controllerName, actionName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + actionName;
        else
            url = '/' + controllerName + '/' + actionName;

        // ajax post
        $.ajax({
            method: 'POST',
            url: url,
            dataType: 'json',
            traditional: true,
            data: model,
            success: function(result) {
                Layout.InfoMessage.Show(result.success == null ? 'Info' : result.success == true ? 'Success' : 'Error', result);
                if (callbacks != null && typeof callbacks.success === 'function') {
                    callbacks.success(result);
                }
            },
            error: function(error) {
                Layout.ErrorDialog.Show('Failed', error);
                if (callbacks != null && typeof callbacks.error === 'function') {
                    callbacks.error(error);
                }
            }
        });
    },

    // update action
    update: function(areaName, controllerName, actionName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + actionName;
        else
            url = '/' + controllerName + '/' + actionName;

        // ajax update
        $.ajax({
            method: 'POST',
            url: url,
            dataType: 'json',
            data: model,
            success: function(result) {
                Layout.InfoMessage.Show('Updated', result);
                if (callbacks != null && typeof callbacks.success === 'function') {
                    callbacks.success(result);
                }
                else {
                    // refresh the page
                    window.location.reload(true);
                }
            },
            error: function(error) {
                Layout.ErrorDialog.Show('Update failed', error);
                if (callbacks != null && typeof callbacks.error === 'function') {
                    callbacks.error(error);
                }
            }
        });
    },

    // remove action
    remove: function(areaName, controllerName, actionName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + actionName;
        else
            url = '/' + controllerName + '/' + actionName;

        bootbox.dialog({
            title: 'Remove',
            message: 'Are you sure you wish to remove this item?',
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: function() {
                        $(this).hide();
                    }
                },
                danger: {
                    label: 'Remove',
                    className: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            method: 'POST',
                            url: url,
                            data: model,
                            success: function(result) {
                                Layout.InfoMessage.Show('Removed', result);
                                if (callbacks != null && typeof callbacks.success === 'function') {
                                    callbacks.success(result);
                                }
                            },
                            error: function(error) {
                                Layout.ErrorDialog.Show('Remove failed', error);
                                if (callbacks != null && typeof callbacks.error === 'function') {
                                    callbacks.error(error);
                                }
                            }
                        })
                    }
                }
            }
        })
    },

    // remove action
    delete: function(areaName, controllerName, actionName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + actionName;
        else
            url = '/' + controllerName + '/' + actionName;

        bootbox.dialog({
            title: 'Delete',
            message: 'Are you sure you wish to delete this item?',
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: function() {
                        $(this).hide();
                    }
                },
                danger: {
                    label: 'Delete',
                    className: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            method: 'POST',
                            url: url,
                            data: model,
                            success: function(result) {
                                Layout.InfoMessage.Show('Delete', result);
                                if (callbacks != null && typeof callbacks.success === 'function') {
                                    callbacks.success(result);
                                }
                            },
                            error: function(error) {
                                Layout.ErrorDialog.Show('Delete failed', error);
                                if (callbacks != null && typeof callbacks.error === 'function') {
                                    callbacks.error(error);
                                }
                            }
                        })
                    }
                }
            }
        })
    },

    // redirects to an action
    action: function(areaName, controllerName, actionName, id) {
        if (!String.IsNullOrEmpty(areaName))
            window.location.href = '/' + areaName + '/' + controllerName + '/' + actionName + '/' + id;
        else
            window.location.href = '/' + controllerName + '/' + actionName + '/' + id;
    },

    // loads a partial view into a dialog and execute callbacks
    loadDialog: function(areaName, controllerName, viewName, title, model, callbacks) {
        this.loadPartial(areaName, controllerName, viewName, model, {
            success: function(result) {
                var dialog = bootbox.dialog({
                    title: title,
                    message: result,
                    buttons: {
                        cancel: {
                            label: "Cancel",
                            className: "btn-default",
                            callback: function() {
                                $(this).hide();
                            }
                        },
                        success: {
                            label: "Save",
                            className: "btn-primary",
                            callback: function() {
                                if (callbacks != null && typeof callbacks.success === 'function') {
                                    callbacks.success(result);
                                }
                            }
                        }
                    }
                });
            }
        });
    },

    // loads a partial view and execute callbacks
    loadPartial: function(areaName, controllerName, viewName, model, callbacks) {
        var url;

        if (!String.IsNullOrEmpty(areaName))
            url = '/' + areaName + '/' + controllerName + '/' + viewName;
        else
            url = '/' + controllerName + '/' + viewName;

        // ajax load
        $.ajax({
            url: url,
            cache: false,
            dataType: 'html',
            data: model,
            success: function(result) {
                if (callbacks != null && typeof callbacks.success === 'function') {
                    callbacks.success(result);
                }
            },
            error: function(error) {
                Layout.ErrorDialog.Show('Load failed', error);
                if (callbacks != null && typeof callbacks.error === 'function') {
                    callbacks.error(error);
                }
            }
        });
    }
};