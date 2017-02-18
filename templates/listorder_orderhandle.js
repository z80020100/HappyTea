
//--------單子顯示相關的函式------------------------------
//
//	ordershow 顯示整張單子，包含viewsummary跟viewshare
//	viewsummary 單子總結
//	viewshare 以小單為單位顯示
//
//--------------------------------------------------------


/*
order_status_change
orderSummary_block
orderShare_block
status_getText
unDoFade
refresh_orderstatus
order_block
refresh_order
*/


$(document).ready(function(){
        $("#nav_open").remove();
        //alertify.log("在單子上左滑右滑會改變他的狀態哦!", "", 4000);
        console.log("Hello");
});


// ------- START change order status with swipe --------------------------------------------

function order_status_change(oid, direction){
	order_detail = "#order_detail_" + oid;
	var req = new Object();
	req["type"] = 'updateOrderStatus';
	req["swipe"] = direction;
	req["current_status"] = $('#order_detail_'+oid).data("status");
	req["oid"] = oid;

	$.ajax( {
		url:"listorder_process.php",
		method: "POST",
		dataType:"json",
		data:{request:req}
	} )
	.done(function(msg){
		$('#order_detail_'+oid).data("status", msg);
		refresh_orderstatus(oid);
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		console.log(textStatus, errorThrown);
	})
	.always(function(msg){
        console.log(msg);
	})
	;

}

var order_swipeleft = function(e){
	order_status_change($(this).attr('order_id'), 'left');
};

var order_swiperight = function(e){
	order_status_change($(this).attr('order_id'), 'right');
};

$("#order_list").on("swipeleft", ".order_view", order_swipeleft);
$("#order_list").on("swiperight",".order_view",order_swiperight);

// ------- END change order status with swipe --------------------------------------------


// ------- START display setting on order list -------------------------------------------
$('.viewshare').hide();  // hide share on default

$('#order_list').on("click", ".order_title", function(e){
	$(this).next('.order_detail').toggle();
});

$('#order_list').on("click", ".button_calshare", function(e){
	$(this).parents('.order_title').next('.order_detail').children('.viewsummary').hide();
	$(this).parents('.order_title').next('.order_detail').children('.viewshare').show();
	$(this).removeClass("ui_button");
	$(this).addClass("ui_button_active");
	$(this).parent().children('.button_viewsum').removeClass("ui_button_active");
	$(this).parent().children('.button_viewsum').addClass("ui_button");
	 e.stopImmediatePropagation();
	 return false;
});

$('#order_list').on("click", ".button_viewsum", function(e){
	$(this).parents('.order_title').next('.order_detail').children('.viewsummary').show();
	$(this).parents('.order_title').next('.order_detail').children('.viewshare').hide();
	$(this).removeClass("ui_button");
	$(this).addClass("ui_button_active");
	$(this).parent().children('.button_calshare').removeClass("ui_button_active");
	$(this).parent().children('.button_calshare').addClass("ui_button");
	 e.stopImmediatePropagation();
	 return false;
});
// ------- END display setting on order list ---------------------------------------------

// debug text
/*
$("#debug_get_table").on("click", function(e){
	$("#debug_text").val(  $("#order_list").html() );
});
*/

// ------- START order adding time -------------------------------------------------------

$('#order_list').on("click", ".button_addtime", function(e){
	
	// getting target id
	oid = $(this).attr('order_id');
	order_detail = "#order_detail_" + oid;

	// configure request
	var req = new Object();
	req["type"] = 'updateOrderEstimate';
	req["addMIN"] = $(this).attr('atime');
	req["oid"] = oid;

	//  ------ START Setting local display of estimate time ------------------------------
	//		Step1: 	getting previous estimate time:
	//		Step2: 	if it is not set, then add target time to current time.
	//				Otherwise, add target time on top of previous estimate time
	//
	// 	* May be omitted due to global update.
	var old_order_esttime = $('.order_view[order_id|='+oid+'] > .order_title > .order_estimate_time').data("est_time");

	if(typeof old_order_esttime == "undefined"){
		var order_esttime = new Date(Date.now() + $(this).attr('atime')*60000);
		$('.order_view[order_id|='+oid+'] > .order_title > .order_estimate_time').data("est_time", order_esttime);
	}
	else{
		var order_esttime = new Date(old_order_esttime.getTime() + $(this).attr('atime')*60000);
		$('.order_view[order_id|='+oid+'] > .order_title > .order_estimate_time').data("est_time", order_esttime);
	}
	//  ------ END Setting local display of estimate time ------------------------------

	//  ------ START sending updateOrderEstimate request to server
	$.ajax( {
		url:"listorder_process.php",
		method: "POST",
		dataType:"text",
		data:{request:req}
	} )
	.done(function(msg){
		console.log("listorder_process.php:[ " +msg +"]");
		//if(msg == 'ok')
		alertify.success("成功修改等待時間", "", 1000);
		time_refresh(2);
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		console.log(textStatus, errorThrown);
	})
	.always(function(){
		//$("#debug_text").val( window.page_ordertime + "...done" );
	})
	;
	//  ------ END sending updateOrderEstimate request to server
	 e.stopImmediatePropagation();  // This is not to trigger click on order_title

	 return false;
});
// ------- END order adding time ---------------------------------------------------------


function orderSummary_block( items_array ){

	var orderSum_start = '\n\
					<table>                                                                                                                                                                                                             \n\
	';

	var orderSum_end = '                                                                                                                                                                                                                        \n\
					</table>                                                                                                                                                                                                           \n\
	';

	Items_html = '';

	for( var item_i in items_array ){
		item = items_array[item_i];
		RO_html = '';
		allROcost = 0;
		for( var ro_i in item.RO_array ){
			ro = item.RO_array[ro_i];
			RO_html = RO_html + ',' + ro.name;
			allROcost = allROcost + Number(ro.price);
		}

		AI_html = '';
		allAIcost = 0;
		for( var ai_i in item.AI_array ){
			ai = item.AI_array[ai_i];
			AI_html = AI_html + ',' + ai.name;
			allAIcost = allAIcost + Number(ai.price);
		}
		itemcost = Number(item.main_price) + Number(allROcost) + Number(allAIcost);

		if(item.comment != ''){
			item.comment = '['+item.comment+']';

		}

		Items_html =  Items_html +
			' 					<tr>                                                                                                                                                                                                       \n\
									<td>'+ item.name +''+ RO_html + AI_html+item.comment+' x'+item.quantity+'</td>                                  \n\
								</tr>';
	}


	return orderSum_start + Items_html + orderSum_end;
}


function status_getText(status){
	var result = {'status_text': '', 'status_class':''}
	switch( status ){
		case 'WAIT':
			result.status_text = "尚在等候";
			result.status_class = "order_waiting";
		break;
		case 'MAKING':
			result.status_text = "製作中";
			result.status_class = "order_making";
		break;
		case 'DONE':
			result.status_text = "已出餐";
			result.status_class = "order_done";
		break;
		case 'PAID':
			result.status_text = "已付帳";
			result.status_class = "order_paid";
		break;
	}
	return result;
}

var t_unDoFade = 0;
var function_timeoutCtrl = null;

function unDoFade(){
	if(t_unDoFade == 0)
		$('#unDo').fadeOut();
	else{
		$('#unDoCntDwn').html("("+t_unDoFade+")");
		t_unDoFade -= 1;
		function_timeoutCtrl = setTimeout('unDoFade()',1000);
	}
}


function refresh_orderstatus( oid , remote_update){
	remote_update = (typeof remote_update !== 'undefined') ? remote_update : false;

	//alert('test');
	var dStatus = $('#order_detail_'+oid).data("status");

	//$("#debug_text").val( $("#debug_text").val() + "\nrefresh_orderstatus\nGET:" + dStatus + "\n");
	if(dStatus == "ARCHIVE"){
		$('.order_view[order_id|='+oid+']').fadeOut();
		if(remote_update == false){
			var clkFunc = new Function("order_status_change("+oid+", 'left');$('#unDo').fadeOut();$('.order_view[order_id|="+oid+"]').fadeIn(); ");

			//$("#debug_text").val( $("#debug_text").val() + '\n' +  clkFunc.toString() + '\n==============\n');
			t_unDoFade = 10;
			$('#unDo').off();
			$('#unDo').on("click", clkFunc);
			$('#unDo').fadeIn();
			$('#unDoText').html("該訂單已被存檔，按此取消 ");
			//alertify.success("訂單已存檔");
			if(function_timeoutCtrl != null)
				clearTimeout(function_timeoutCtrl);
			unDoFade();
		}
	}
	else if(dStatus == "CANCEL"){
		$('.order_view[order_id|='+oid+']').fadeOut();
		if(remote_update == false){
			var clkFunc = new Function("order_status_change("+oid+", 'right');$('#unDo').fadeOut();$('.order_view[order_id|="+oid+"]').fadeIn(); ");

			//$("#debug_text").val( $("#debug_text").val() + '\n' +  clkFunc.toString() + '\n==============\n');
			t_unDoFade = 10;
			$('#unDo').off();
			$('#unDo').on("click", clkFunc);
			$('#unDo').fadeIn();
			$('#unDoText').html("該訂單已被刪除，按此取消");
			//alertify.success("訂單已刪除");
			if(function_timeoutCtrl != null)
				clearTimeout(function_timeoutCtrl);
			unDoFade();
		}
	}
	else {
		$('.order_view[order_id|='+oid+']').fadeIn();
		var r = status_getText($('#order_detail_'+oid).data("status"));
		status_text = r.status_text;
		status_class = r.status_class;
		$('.order_view[order_id|='+oid+'] > .order_title > .order_status').html(status_text);
		$('#order_detail_'+oid).removeClass('order_waiting');
		$('#order_detail_'+oid).removeClass('order_making');
		$('#order_detail_'+oid).removeClass('order_done');
		$('#order_detail_'+oid).removeClass('order_paid');

		$('#order_detail_'+oid).addClass(status_class);
	}
}

function order_block( order_info ){

	var order_disptime = order_info.o_time;

	var orderblock_start = '<tbody class="order_view" order_id="'+order_info.o_id+'">                               \n\
			<tr class="order_title" id="order_detail_'+order_info.o_id+'">                                 			\n\
				<th>#'+order_info.o_id+'</th>        \n\
				<th class="order_status"></th>                                                                      \n\
				<th>'+orderSummary_block(order_info.summary_array)+'</th>                                           \n\
				<th>$'+order_info.total+'</th>                                                                      \n\
			</tr>                                                                                                   \n\
																													\n\
			<tr  class="order_detail" >                                                                        		\n\
	';
    /*var orderblock_start = '<tbody class="order_view" order_id="'+order_info.o_id+'">                               \n\
			<tr class="order_title" id="order_detail_'+order_info.o_id+'">                                 			\n\
				<th class="order_status"></th>                                                                      \n\
				<th>'+orderSummary_block(order_info.summary_array)+'</th>                                           \n\
				<th>$'+order_info.total+'</th>                                                                      \n\
			</tr>                                                                                                   \n\
																													\n\
			<tr  class="order_detail" >                                                                        		\n\
	';*/
    var colindex = $(this).parent().children().index($(this));
    console.log(colindex);
    $('td:nth-child('+(colindex+1)+')').hide();
$('td:nth-child(0)').hide(); 
	console.log('WTF:'+order_info.o_estimate_time);
	if( order_info.o_estimate_time == 'NULL' ){
		var order_est_disptime = '---';
	}
	else{
		t = order_info.o_estimate_time.split(/[- :]/);
		var order_esttime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);


		var timeDiff = order_esttime.getTime() - Date.now();
		var diffMins = Math.ceil(Math.abs(timeDiff) / (1000 * 60));
		if(timeDiff > 0)
			var order_est_disptime = diffMins + '分鐘';//order_info.o_estimate_time;
		else
			var order_est_disptime = '超過' + diffMins + '分鐘';//order_info.o_estimate_time;

		$('.order_view[order_id|='+order_info.o_id+'] > .order_title > .order_estimate_time').data("est_time", order_esttime);		//將估計完成時間寫入

	}

	//$("#order_list_header").after( orderblock_start + '<tr><td colspan="7" class="separator"></td></tr></tbody>');  // -- 寫入html
	//order_list
	$("#order_list").append( orderblock_start + '<tr><td colspan="7" class="separator"></td></tr></tbody>');  // -- 寫入html

	var t = order_disptime.split(/[- :]/);
	var ordertime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);


		//$('.order_view[order_id|='+order_info.o_id+'] > .order_title > .order_time').data("time", ordertime);		//將點單時間寫入，未來可能用上
		//$('.order_view[order_id|='+order_info.o_id+'] > .order_title > .order_time').html( order_disptime ); 		//顯示時間
		$('#order_detail_'+order_info.o_id).data("status",  order_info.status);						//將資料庫的status寫入order中
		//$('.order_view[order_id|='+order_info.o_id+'] > .order_title > .order_estimate_time').html( order_est_disptime ); 		//顯示預計時間

	//var r = status_getText(order_info.status);
	//status_text = r.status_text;
	//status_class = r.status_class;
	//alert(order_info.o_id);
	refresh_orderstatus(order_info.o_id);
}



window.page_ordertime = '1900-01-01 00:00:00';

var bellring /*= new Audio("templates/iphone_sound.mp3")*/;


function refresh_order( fresh_page  ){
	fresh_page = (typeof fresh_page !== 'undefined') ? fresh_page : false;

	var req = new Object();
	req["type"] = 'refresh';
	req["time"] = window.page_ordertime;

	if(fresh_page == true){
		req["fresh"] = true;
		console.log("fresh:true");
	}
	else{
		req["fresh"] = false;
		console.log("fresh:false");
	}
    //console.log(req);
	$.ajax( {
		url:"listorder_process.php",
		method: "POST",
		//dataType:"text",
		dataType:"json",
		data:{request:req}
	} )
	.done(function(msg){
        console.log(msg);
		if( msg.length ){
			console.log(msg[0]);
			$("#debug_text").val(msg[0]['share_array'][0]['items_array'][0]['name']);
            console.log(msg[0]['share_array'][0]['items_array'][0]['name']);
			$("#debug_text").val(  $("#debug_text").val( )+ msg[msg.length-1]['o_time'] + '\n');
			//alert( msg[0]['o_id'] );

			//var t =msg[0]['o_time'].split(/[- :]/);

			// Apply each element to the Date function
			//var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

			//alert(msg.length);

			// Generate block!
			var block_generated = false;
			for( i = 0 ; i < msg.length ; i++){
				if(window.page_ordertime < msg[i]['o_utime'])
					window.page_ordertime = msg[i]['o_utime'];

				if($('#order_detail_'+msg[i].o_id).length == 0){  // 檢查伺服器送來的單在本地端是否存在
					//alert(msg[i].status);
					if(msg[i].status != 'ARCHIVE' && msg[i].status != 'CANCEL'){
						// 若伺服器送來的單這邊不存在，而且需要被顯示出來，就產生block
						order_block(msg[i]);
						console.log("new block:"+msg[i].o_id);
						block_generated = true;
					}
					else{
						// 如果從伺服器送來的單在這邊不存在，也不需要被顯示出來，那就不產生 block
						console.log("new block no show:"+msg[i].o_id);
					}

				}
				else{
					// 在本地端存在的話就刷新本地端的單子資訊

					//alert(msg[i]['status']);
					$('#order_detail_'+msg[i].o_id).data("status", msg[i]['status']);

					if(msg[i].o_estimate_time != 'NULL'){
						var t = msg[i].o_estimate_time.split(/[- :]/);
						var order_esttime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
						//console.log("refresh block: [est time] "+msg[i][')
						$('.order_view[order_id='+msg[i].o_id+'] > .order_title > .order_estimate_time').data("est_time", order_esttime);
					}
					time_refresh(3);
					refresh_orderstatus(msg[i].o_id, true);
					console.log("refresh block:"+msg[i].o_id);
				}

			}
			if(block_generated == true){
				console.log("play bell!");
				//bellring.play();
			}
			$('#order_list').enhanceWithin();
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		console.log(textStatus, errorThrown);
		//$("#debug_text").val(textStatus); //alert(textStatus);
	})
	.always(function(msg){
            console.log(msg);
		//$("#debug_text").val( window.page_ordertime + "...done" );
	})
	;


}
//refresh_order();
refresh_order(true);
setInterval( function(){ refresh_order(false); }, 3000);


 function time_refresh( alt )
 {
	 $('.order_view > .order_title > .order_estimate_time').each(function(index){

		//alertify.log($(this).data("est_time"));
		var order_esttime = $(this).data("est_time");
		console.log('WTF2:('+alt+')'+(typeof order_esttime));

		if(typeof order_esttime != "undefined"){
			var timeDiff = order_esttime.getTime() - Date.now();
			var diffMins = Math.ceil(Math.abs(timeDiff) / (1000 * 60));
			if(timeDiff > 0)
				var order_est_disptime = diffMins + '分鐘';//order_info.o_estimate_time;
			else
				var order_est_disptime = '超過' + diffMins + '分鐘';//order_info.o_estimate_time;
			//alert(order_est_disptime);
			$(this).html( order_est_disptime ); 		//顯示時間
		}
	 });

 }


setInterval('time_refresh(1)',10000);
