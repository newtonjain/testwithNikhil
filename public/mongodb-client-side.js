
$(document).ready(function () {

    /**
     *  handle query method radio button click
     */
    $('input:radio[name=queryType]').click(function () {
        var queryMethod = $('input[name=queryType]').filter(':checked').val();
        if (queryMethod === 'findOneAndUpdate') {
            $('#updateSection').find('*').attr('disabled', false);
            $('#updateSectionHeader').html("Enter Update");
        }
        else if (queryMethod === 'findOneAndReplace') {
            $('#updateSection').find('*').attr('disabled', false);
            $('#updateSectionHeader').html("Enter New document");
        }
    });

    /**
     *  handle query method radio button click
     */
    $('input:radio[name=deleteType]').click(function () {
        var deleteMethod = $('input[name=deleteType]').filter(':checked').val();
        if (deleteMethod === 'deleteOne' || deleteMethod === 'deleteMany' ) {
            $('#deleteProjectionDiv').find('*').attr('disabled', true);
            $('#deleteSortDiv').find('*').attr('disabled', true);
        }
        else {
            $('#deleteProjectionDiv').find('*').attr('disabled', false);
            $('#deleteSortDiv').find('*').attr('disabled', false);
        }
    });


    /**
     *  handle click on the query button
     */
    $("#queryButton").click(function () {
       var data = {
            "selector": parseJSONField('#queryText'),
            "update": parseJSONField('#updateSet'),
            "options": {
                "projection": parseJSONField('#projection'),
                "sort": parseJSONField('#sort'),
                "maxTimeMS": parseIntField('#maxTimeMS'),
                "upsert": parseBool($('input[name=upsert]').filter(':checked').val()),
                "returnOriginal": parseBool($('input[name=returnOriginal]').filter(':checked').val())
            }
        };
        var queryMethod = $('input[name=queryType]').filter(':checked').val();
        doPost(queryMethod, data);
    });


    $("#deleteButton").click(function () {
        var options = parseJSONField('#deleteOptions') || {};
        options.projection = parseJSONField('#deleteProjection');
        options.sort = parseJSONField('#deleteSort');
        var data = {
            "selector": parseJSONField('#deleteQuery'),
            "options": options
         }
        var queryMethod = $('input[name=deleteType]').filter(':checked').val();
        doPost(queryMethod, data);
    });

    var parseJSONField = function (fieldName) {
        var text = $(fieldName).val().trim();
        var result = text.length > 0 ? JSON.parse(text) : undefined;
        return result;
    };

    var parseBool = function (text) {
        var result = false;
        if (text) {
            text = text.trim().toLowerCase();
            result = text === 'true';
        }
        return result;
    };

    var parseIntField = function (fieldName) {
        var result = undefined;
        var text = $(fieldName).val();
        if (text) {
            result = parseInt(text.trim());
        }
        return result;
    };

    var doPost = function (mongoDBMethod, data) {

        $.post("/mongodb/" + mongoDBMethod, data)
            .fail(function (err) {
                $('#queryResultsDiv').empty();
                $('#queryStatusOK').empty();
                $('#queryStatusError').empty().append(err.responseText);
            })
            .done(function (data) {
                    $('#queryStatusError').empty();
                    $('#queryStatusOK').empty();
                    $('#queryResultsDiv').empty();

                if (typeof data === 'string' ) {
                    $('#queryStatusOK').append(data); 
                }
                else if (typeof data === 'object' && data.status) {
                    $('#queryStatusOK').append(data.status); 
                }
                else if (Array.isArray(data)) {
                    $('#queryStatusOK').append('Query returned ' + data.length + ' records');

                    var table = $('<table></table>').addClass('resultTable');

                    if (data.length > 0) {
                        if (data[0]) {
                            var headers = Object.getOwnPropertyNames(data[0]);
                            var row = $('<tr></tr>').addClass('headerRow');
                            for (var i = 0; i < headers.length; i++) {
                                var cell = $('<td></td>').addClass('headerCell').text(headers[i]);
                                row.append(cell);
                            };

                            table.append(row);

                            for (var i = 0; i < data.length; i++) {
                                var row2 = $('<tr></tr>').addClass('resultRow');
                                for (var j = 0; j < headers.length; j++) {
                                    var cell2 = $('<td></td>').addClass('resultCell').text(data[i][headers[j]]);
                                    row2.append(cell2);
                                }
                                table.append(row2);
                            };
                        }
                        $('#queryResultsDiv').append(table);
                    }
                }
            });
    };
});
    
