$(document).ready(function(){
  $('button').on('click', function() {

    if ($(this).text() == '尚未處理') {
        alert('總店尚未處理叫料')
        return;
    }

    $(this).parent().parent().css('display', 'none');
    // configure a new request
    // call_time, ingredient, num, unit
    var req = {
    	"call_time": $(this).parent().prev().prev().prev().text(),
    	"ingredient": $(this).parent().prev().prev().text(),
    	"num": $(this).parent().prev().text().split(" ")[0],
    	"unit": $(this).parent().prev().text().split(" ")[1]
    };

    /****
		$(this).parent(): the last <td> -> 已處理
		In <tr>:

        handled = 0:
		    call_time -> ingredient -> num ["space"] unit -> 尚未處理
    	handled = 1:
            call_time -> ingredient -> num ["space"] unit -> 已處理

    	in order
    ****/

    console.log(JSON.stringify(req));
    // ----- send a request to inventory_process.php -----
    $.ajax( {
		url: "called_stuff_process.php",
		method: "POST",
		dataType: "text",
		data: {request: req}
	} )
	.done(function(msg){
		console.log('Update the database!');
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		console.log(textStatus, errorThrown);
		alert('處理失敗！')
	})
	.always(function(){

	});
  })
});