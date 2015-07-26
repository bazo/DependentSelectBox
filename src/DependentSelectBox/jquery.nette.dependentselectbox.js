/**
 * @author Daniel Robenek
 * @license MIT
 */

/**
 *    $(document).ready(function() {
 *		$.dependentselectbox.initialize();
 *	});
 *
 *    Add to jquery.nette.js at the end of $.nette.success:
 *    $.dependentselectbox.hideSubmits();
 *    or use livequery
 */
jQuery.extend({
    dependentselectbox: {
        controlClass: 'dependentControl',

        buttonSuffix: '_submit',

        hideSubmits: function () {
            // Here hide all you want. Default is to hide <tr> of button
            $('.' + $.dependentselectbox.controlClass + $.dependentselectbox.buttonSuffix).parent().parent().hide();
        },

        initialize: function () {
            $.dependentselectbox.hideSubmits();
            $(document).on('change', function (e) {
                    if ($(e.target).is('.' + $.dependentselectbox.controlClass)) {
                        // Nette form validation
                        button = document.getElementById((e.currentTarget.activeElement.id) + $.dependentselectbox.buttonSuffix);
                        button.form["nette-submittedBy"] = button;
                        // ----
                        var el = $('#' + (e.currentTarget.activeElement.id) + $.dependentselectbox.buttonSuffix);
                        //el.click();
                        var form = el.closest('form');
                        var sendValues = {};
                        sendValues[el.attr("name")] = el.val()
                        var values = form.serializeArray();
                        for (var i = 0; i < values.length; i++) {
                            var name = values[i].name;
                            // multi
                            if (name in sendValues) {
                                var val = sendValues[name];
                                if (!(val instanceof Array)) {
                                    val = [val];
                                }
                                val.push(values[i].value);
                                sendValues[name] = val;
                            } else {
                                sendValues[name] = values[i].value;
                            }
                        }
                        console.log(sendValues);
                        $.ajax({
                            url: form.attr('action'),
                            data: sendValues,
                            type: form.attr('method')
                        }).success($.dependentselectbox.jsonResponse)
                    }
                }
            )
            ;
        },

        updateSelectBox: function (id, selectedKey, items) {
            $("#" + id + " option").remove();
            var select = $("#" + id);
            for (var i in items) {
                var item = $("<option></option>").attr("value", i).html(items[i]);
                if (i == selectedKey)
                    item.attr("selected", "selected");
                if (i == "")
                    select.prepend(item);
                else
                    select.append(item);
            }
        },

        jsonResponse: function (payload) {
            if (!(payload["type"] && payload["type"] == "JsonDependentSelectBoxResponse")) {
                $.nette.success(payload);
                return;
            }
            var items = payload["items"];
            for (var i in items) {
                $.dependentselectbox.updateSelectBox(i, items[i]["selected"], items[i]["items"]);
            }
        }
    }
});

$(document).ready(function () {
    $.dependentselectbox.initialize();

});