$(document).ready(function() {
    $('#submit').on('click', function() {
        // configure a request array
        var req = [];
        $('#form tr').each(function() {
            // get raw name
            var raw_name = $(this).children().find('input[name=name]');
            // get unit
            var unit = $(this).children().find('input[name=unit]');
            // non undefined && non empty
            if (raw_name.val() != undefined && raw_name.val() != "" &&
                unit.val() != undefined && unit.val() != "") {
                // configure a new request
                var _req = {};
                _req = {
                    "raw_name": raw_name.val().replace(/\s+/g, ''),
                    "unit": unit.val().replace(/\s+/g, '') // remove space
                }
                req.push(_req);
                // clear input
                raw_name.val('');
                unit.val('');
            }
        });
        if (req.length == 0) {
            alert('請至少新增一項新的補料，且名稱單位皆須填寫')
            return;
        }

        console.log(JSON.stringify(req));

        // ----- send calls to call_process.php -----
        $.ajax({
                url: "add_raw_process.php",
                method: "POST",
                dataType: "text",
                data: {
                    request: req,
                    op: 'add_raw'
                }
            })
            .done(function(msg) {
                console.log('Submit a call!');
                alert('已經新增');
                // setTimeout(function(){ alert('已經叫料'); }, 1000);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert('叫料失敗！')
            })
            .always(function() {
                window.location.reload();
            });

    });

    $("button[id^='delete_']").on('click', function() {
        console.log("raw_id = " + $(this).val());
        var raw_id = $(this).val();

        $.ajax({
                url: "add_raw_process.php",
                method: "POST",
                dataType: "text",
                data: {
                    'raw_id': raw_id,
                    op: 'del_raw'
                }
            })
            .done(function(msg) {
                console.log('Submit a call!');
                alert('刪除成功');
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert('刪除失敗！')
            })
            .always(function() {
                window.location.reload();
            });
    });
});