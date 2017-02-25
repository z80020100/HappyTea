/* Edit Menu Function on jQuery v1.11.3 */
jQuery.ajaxSetup({async:false});

// Global Variables
global_main_name = "";
global_main_price = "";
global_main_series = "";
global_single_at_id = Array();
global_mul_at_id = "";
global_m_id = ""; // 修改品項回復用

global_sort_main_list = Array();
global_sort_series = "";

function init_global_var()
{
	global_main_name = "";
	global_main_price = "";
	global_main_series = "";
	global_single_at_id.length = 0;
	global_mul_at_id = "";
}

function backup_to_global()
{
	global_main_series = ($("#new_main_series").val()); // .val()取得select中被選取的option的value
	global_main_name = $("#new_main_name").val().replace(/\s/g, ''); // 去除所有空白
	global_main_price = $("#new_main_price").val();
	global_mul_at_id = $("[name='mul']:checked").attr("id");
	
	var single_checked = $("[name='single']:checked"); // 所有checked元素的陣列
	for(var i = 0; i < single_checked.size(); i++){
		var at_id = $(single_checked[i]).attr("id");
		global_single_at_id.push(at_id);
	}
}

function restore_from_global()
{
	$("#new_main_name").val(global_main_name);
	$("#new_main_price").val(global_main_price);
	$("#new_main_series").val(global_main_series);
	$("#" + global_mul_at_id).attr("checked", true); // 選取
	for(var i = 0; i < global_single_at_id.length; i++){
		$("#" + global_single_at_id[i]).attr("checked", true); // 選取
	}
	init_global_var();
}

function edit_series(){
	var series_edit = $(this);
	series_edit.unbind('click');
	var s_id = parseInt(series_edit.attr("id").replace("es_", ""));
	
	series_edit.css({
		"border": "2px gray solid",
		"background-color": "#FFFFCC"
	});
	
	var old_series = series_edit.val();
	
	series_edit.bind('blur', function(){		
		var series_text = series_edit.val().replace(/\s/g, ''); // 去除字串中所有空白
		//console.log(series_text);
		
		if(series_text == '') {
			alertify.error("系列名稱不得為空白!");  
			series_edit.val(old_series);
			//series_edit.blur();
		}
		
		else{
			series_edit.val(series_text);
			
			if(series_text == old_series){
				alertify.log("系列名稱「" + old_series + "」未修改");
			}
			else{
				
				$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {"action": "edit_series", "series_text": series_text, "s_id": s_id},
					async:false
				})
				.done(function(msg){
					//alert(msg);
					alertify.success("修改「" + old_series + "」為「" + series_text + "」"); 
				})
				.fail(function(){
					alertify.error('修改系列失敗！');
					series_edit.val(old_series);
				})
				;
			}
		}
		
		series_edit.css({
			"border": "0px gray solid",
			"background-color": "#FFFFFF"
		});
		series_edit.unbind('blur');
		series_edit.bind('click', edit_series);
	});
	
	series_edit.bind("keydown", function(key){
		if(key.which == 13){ // Enter
			series_edit.trigger("blur");
		}
	});
}

function add_series() {
	var new_series;
	alertify.prompt("請輸入新系列名稱", function(e, new_series) {
		if(e && (new_series != "")) {  
			
			$.ajax({
				url:"edit_menu_op.php",
				method: "POST",
				dataType:"json",
				data: {"action": "add_series", "new_series": new_series, "order_number": 1},
				async:false
			})
			.done(function(msg){
				//alert(msg);
				alertify.success("新增系列：" + new_series);
				$("#series_table").load("edit_menu.php #series_table > div");
				//window.location.reload();
				series_table_bind();
				read_series_for_pre();
			})
		    .fail(function(){
				alertify.error('新增系列失敗！');  
			})
			;
			
		}
		else {  
			alertify.error('新增系列操作取消！');  
		}  
	}, "");  
}


function edit_ai(){
	$(this).unbind("click");
	$(this).css({"border": "1px solid gray", "background-color": "#FFEE99"});
	$(this).attr({"data-old_data":$(this).val()});
}

function read_series_for_pre()
{
	$("#batch_main_series").empty();
	$("#batch_main_series").append($("<option>").attr({"value": 's_0'}).append('預先選取新增系列'));
	// 取得所有系列名稱
	$.ajax({
		url:"edit_menu_op.php",
		method: "POST",
		dataType:"json",
		data: {"action": "get_series"},
		async:false
	})
	.done(function(series_array){
		
		for(var i = 0; i < $(series_array).size(); i++){
			console.log(series_array[i]);
			$("#batch_main_series").append($("<option>").attr({"value": 's_' + series_array[i]['s_id']}).append(series_array[i]['name']));
		}
		$("#batch_main_series").val('s_0'); // 預設選取此選項
	})
    .fail(function(){
		alertify.error('讀取系列失敗！');
	});
}

function add_item(){
	// 新增系列預選
	var pre_select_series_id = $("#batch_main_series").val();
	
	// 關閉視窗
	$("#close_new_main_win").bind('click', close_new_main_win); // 關閉新增品項視窗
	
	// 初始化
	$("#detail_title").show();
	$("#add_item_finish").show();
	$("#new_main_win_h3").text('新增品項');
	$("#new_main_name").val('');
	$("#new_main_price").val('0');
	$("#edit_item_submit").remove();
	$("#del_item_submit").remove();
	
	$("#new_main_series").empty();
	$("#new_main_series").append($("<option>").attr({"value": 's_0'}).append('請選擇系列名稱'));
	$("#new_main_series").val('s_0'); // 預設選取此選項
	
	$("#multi_choice").empty();
	$("#single_choice").empty();
	$("#single_choice").append($("<input>").attr({'type':"radio", 'name':"mul", 'value':"at_0", 'id':"at_0", 'checked':true}));
	$("#single_choice").append($("<label>").attr({'for':"at_0"}).append('&nbsp;無加點&nbsp;'));
	
	$("#edit_add").empty();
	$("#edit_add").append($("<span>").append('細項編輯'));
	$("#edit_add").append($("<div>").attr({'id':'edit_add_detail'}));
	
	
	// 取得所有系列名稱
	$.ajax({
		url:"edit_menu_op.php",
		method: "POST",
		dataType:"json",
		data: {"action": "get_series"},
		async:false
	})
	.done(function(series_array){
		
		for(var i = 0; i < $(series_array).size(); i++){
			console.log(series_array[i]);
			$("#new_main_series").append($("<option>").attr({"value": 's_' + series_array[i]['s_id']}).append(series_array[i]['name']));
		}
		$("#new_main_series").val(pre_select_series_id); // 預設選取此選項
	})
    .fail(function(){
		alertify.error('讀取系列失敗！');
	});
	
	// 取得所有加點類型名稱
	$.ajax({
		url:"edit_menu_op.php",
		method: "POST",
		dataType:"json",
		data: {"action": "get_add_type"},
		async:false
	})
	.done(function(add_type_array){

		for(var i = 0; i < $(add_type_array).size(); i++){
			console.log(add_type_array[i]);
			if(add_type_array[i]['multiple_choice'] == '0') {// 下單時為單選的細項
				$("#multi_choice").append($("<input>").attr({'type':"checkbox", 'name':"single", 'value':"at_" + add_type_array[i]['at_id'], 'id':"at_" + add_type_array[i]['at_id']}));
				$("#multi_choice").append($("<label>").attr({'for':"at_" + add_type_array[i]['at_id']})
					.append($("<a>").attr({"href":"javascript:void(0)", "id": "edit_at_" + add_type_array[i]['at_id'], "class":"icon"}).append($("<img>").attr({"src": "icon/edit_at_icon.png"})))
					.append($("<span>").append(add_type_array[i]['option_name']))
					.append($("<a>").attr({"href":"javascript:void(0)", "id": "del_at_" + add_type_array[i]['at_id'], "class":"icon"}).append($("<img>").attr({"src": "icon/del_at_icon.png"})))
				);
					
			}
			else{
				$("#single_choice").append($("<input>").attr({'type':"radio", 'name':"mul", 'value':"at_" + add_type_array[i]['at_id'], 'id':"at_" + add_type_array[i]['at_id']}));
				$("#single_choice").append($("<label>").attr({'for':"at_" + add_type_array[i]['at_id']})
					.append($("<a>").attr({"href":"javascript:void(0)", "id": "edit_at_" + add_type_array[i]['at_id'], "class":"icon"}).append($("<img>").attr({"src": "icon/edit_at_icon.png"})))
					.append($("<span>").append(add_type_array[i]['option_name']))
					.append($("<a>").attr({"href":"javascript:void(0)", "id": "del_at_" + add_type_array[i]['at_id'], "class":"icon"}).append($("<img>").attr({"src": "icon/del_at_icon.png"})))
				);
				
			}
			
			// 編輯細項視窗
			$("#edit_at_" + add_type_array[i]['at_id']).bind('click', function(){
				var at_id = $(this).attr('id').replace("edit_at_", "");
				$("#edit_add > span").text("細項編輯"); // 刪除其他文字
				var add_type; //決定填入值（單選/多選）
				var input_type; //決定input type（radio/checkbox）
				
				if($("#at_" + at_id).attr("name")=="mul"){
					add_type = "加點細項(單選)";
					input_type = "checkbox";
				}
				else{
					add_type = "主餐細項(多選)";
					input_type = "radio";
				}
				$("#edit_add > span").append(" -> " + add_type + " -> ");
				$("#edit_add > span").append($("<input>").attr({"id":"edit_add_type_name", "type":"text", "value":$("[for='at_" + at_id + "']").text(), "data-at_id":at_id}));
				$("#edit_add > span").append(" 點擊左側可重新命名");
                $("#edit_add > span").append($("<br>"));
				$("#edit_add > span").append($("<img>").attr({"id":"add_additional_item", "src":"icon/add_ai_icon.png"})); // 新贈細項按鈕
				
				// 新增細項按鈕功能實作
				$("#add_additional_item").bind('click', function(){
					var ai_name;
					var ai_price;
					
					alertify.prompt("請輸入新細項名稱", function(e, ai_name) {
						if(e){
							ai_name = ai_name.replace(/\s/g, '');
							if(ai_name != ""){
								alertify.prompt("請輸入新細項價格", function(e, ai_price) {
									var price_err_msg = "";
									if(e){

										if($.isNumeric(ai_price)){
											if(parseInt(ai_price) < 0){
												price_err_msg = "價格不可小於零！";
											}
										}
										else{
											price_err_msg = "請輸入正確價格";
										}
										
										if(price_err_msg == ""){
											
											console.log("at_id: " + at_id);
											console.log("名稱：" + ai_name);
											console.log("價格：" + ai_price);
											$.ajax({
												url:"edit_menu_op.php",
												method: "POST",
												dataType:"json",
												data: {
													"action": "add_additional_item", 
													"at_id":at_id, 
													"name":ai_name,
													"price":ai_price
												},
												async:false
											})
											.done(function(){
												alertify.success("新增細項成功！");
												$("#edit_at_" + at_id).trigger('click');
											})
											.fail(function(){
												alertify.error("新增細項傳輸錯誤！");
											});
										}
										else{
											alertify.error(price_err_msg);  
										}
									}
									else{
										alertify.error('新增細項取消！');  
									}
								}, "");
								$("#alertify-text").attr({"placeholder":"請輸入「價格」", "type":"number", "value": "0"});
							}
						}
						else {  
							alertify.error('新增細項取消！');  
						}  
					}, "");
					$("#alertify-text").attr({"placeholder":"請輸入「名稱」"});
				});
				
				// 編輯加點類別名稱用
				$("#edit_add_type_name").bind('focus', function(){ // 點擊開始編輯
					$(this).css({
						"background-color": "rgb(255, 238, 153)",
						"border-style": "solid"
					}).attr({'data-old_name':$(this).val()});
				});
				
				$("#edit_add_type_name").bind('blur', function(){ // 離開結束編輯並儲存
					$(this).css({
						"background-color": "rgb(255, 255, 221)",
						"border-style": "solid"
					});
					var at_id = $(this).attr("data-at_id");
					var new_at_name = $(this).val().replace(/\s/g, ''); // 去除字串中所有空白
					$(this).val(new_at_name);
					//console.log(new_at_name);
					if(new_at_name != ''){ // ajax寫入資料庫、更改畫面

						$.ajax({ //編輯細項資料
							url:"edit_menu_op.php",
							method: "POST",
							dataType:"json",
							data: {"action": "edit_at_name", "new_at_name": new_at_name, "at_id": at_id},
							async:false
						})
						.done(function(msg){
							alertify.success('細項名稱已修改！');
							$("[for='at_" + at_id  + "'] > span").text(new_at_name);
							
						})
						.fail(function(){
							alertify.error("編輯細項失敗：資料庫傳輸錯誤");
							$("#edit_add_type_name").val($("#edit_add_type_name").attr('data-old_name'));
						});
						
					}
					else{
						alertify.error('細項類別名稱不可空白！');
						$(this).val($(this).attr('data-old_name'));
					}					
				});
				
				
								
				$.ajax({ // 取得細項資料
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {"action": "get_add_data", "at_id": at_id},
					async:false
				})
				.done(function(add_data_array){
					$("#edit_add_detail").empty(); // 清空前次資料
					for(var i = 0; i < $(add_data_array).size(); i++){
						var edit_add_detail_div = $("<div>").css({'border-color':'#ABABAB', 'border-style':'solid', 'border-width':'1px', 'border-radius':'20px'});
						
						// 刪除細項按紐實作
						var del_additional_item_button = $("<a>").attr({"id":"del_additional_item_" + add_data_array[i]["ai_id"], "href":"javascript:void(0)"})
							.append($("<img>").attr({"src":"icon/del_ai_icon.png"})
						);
						del_additional_item_button.bind('click', function(){
							var ai_id = $(this).attr('id').replace('del_additional_item_', '');
							console.log('ai_id: ' + ai_id);
							console.log('at_id: ' + at_id);
							$.ajax({
								url:"edit_menu_op.php",
								method: "POST",
								dataType:"json",
								data: {
									"action": "del_additional_item", 
									"ai_id":ai_id
								},
								async:false
							})
							.done(function(){
								alertify.success('刪除細項成功');
								$("#edit_at_" + at_id).trigger('click');
							})
							.fail(function(){
								alertify.error("刪除細項傳輸錯誤！");
							});
						});
						
						edit_add_detail_div.append(del_additional_item_button);
						edit_add_detail_div.append($("<input>").attr({"type": input_type, "name": "#", "style":"margin-left: 30px; margin-right: 5px;"}));
						edit_add_detail_div.append($("<input>").attr({"id": "ai_" + add_data_array[i]["ai_id"], "type": "text", "value": add_data_array[i]['name'], "style": "border: 0px; background-color: #FFFFDD;"}));
						edit_add_detail_div.append($("<input>").attr({"id": "ai_" + add_data_array[i]["ai_id"] + "_price", "type": "text", "value": add_data_array[i]['price'], "style": "border: 0px; background-color: #FFFFDD; text-align:right;"}));
						edit_add_detail_div.append("元");
						

						
						$("#edit_add_detail").append(edit_add_detail_div);
						$("[id^='ai_" + add_data_array[i]["ai_id"] + "']").bind("click", edit_ai);
						$("[id^='ai_" + add_data_array[i]["ai_id"] + "']").bind("blur", function(){
							var new_ai_data_err_msg = '';
							var new_ai_data_jqobj = $(this);
							var new_ai_data = $(this).val().replace(/\s/g, ''); // 去除字串中所有空白
							console.log(new_ai_data);

							var ai_id = $(this).attr("id").replace("ai_", "").replace("_price", "");
							var edit_data = "name";
							if($(this).attr("id").replace("ai_" + ai_id + "_", "") == "price"){
								edit_data = "price";
							}
							
							if(edit_data == "price"){
								if(!$.isNumeric(new_ai_data)){ // 判斷是否為純數字
									new_ai_data_err_msg = "編輯細項失敗：價格含有非法字元";
								}
							}
							else{
								if(new_ai_data == ''){
									new_ai_data_err_msg = "編輯細項失敗：細項名稱不可空白";
								}
							}
							
							if(new_ai_data == new_ai_data_jqobj.attr('data-old_data'))
								new_ai_data_err_msg = "資料未修改";
							
							
							if(new_ai_data_err_msg == ''){
								new_ai_data_jqobj.val(new_ai_data);
								
								$.ajax({ //編輯細項資料
									url:"edit_menu_op.php",
									method: "POST",
									dataType:"json",
									data: {"action": "edit_ai", "new_ai_data": new_ai_data, "ai_id": ai_id, "edit_data": edit_data},
									async:false
								})
								.done(function(msg){
									alertify.success('細項內容已修改！');
									
								})
								.fail(function(){
									alertify.error("編輯細項失敗：資料庫傳輸錯誤");
									new_ai_data_jqobj.val(new_ai_data_jqobj.attr('data-old_data'));
								});
							}
							else if(new_ai_data_err_msg == "資料未修改"){
								alertify.log(new_ai_data_err_msg);	
							}
							else{
								alertify.error(new_ai_data_err_msg);
								new_ai_data_jqobj.val(new_ai_data_jqobj.attr('data-old_data'));
							}

							$(this).css({"border": "0px", "background-color": "#FFFFDD"});
							$(this).bind("click", edit_ai);
						});
						
						
						console.log(add_data_array[i]);
					}
					//console.log(add_data_array);
				});
				
				
				
			});
			
			$("#del_at_" + add_type_array[i]['at_id']).bind('click', function(){
				var at_id = $(this).attr("id").replace("del_at_", "");
				backup_to_global();
				console.log(at_id);
				alertify.confirm("確定刪除「" + $(this).parent().text() + "」？", function(e){
					//alert(at_id);
					if(e){

						$.ajax({ //刪除細項種類
							url:"edit_menu_op.php",
							method: "POST",
							dataType:"json",
							data: {"action": "del_additional_type", "at_id": at_id},
							async:false
						})
						.done(function(msg){
							alertify.success('細項已刪除！');
							unbind_new_main_win();
							
							if($("#new_main_win_h3").text() == '編輯加點項目'){ // 修改編輯加點視窗畫面
								$("#edit_additional").trigger('click');
							}
							else if($("#new_main_win_h3").text() == '編輯品項'){
								$("#" + global_m_id).trigger('click');
								restore_from_global();
							}
							else{
								$("#add_main").trigger('click');
								restore_from_global();
							}
						})
						.fail(function(){
							alertify.error("刪除細項失敗：資料庫傳輸錯誤");
							
						});
						
					}
					else{
						alertify.error("刪除細項取消！");
					}
				})
			});
		}
		
	})
    .fail(function(){
		alertify.error('讀取細項類別失敗！');
	});

	//$("#add_detail").bind('click', detail_div);
	
	// 確定按鈕
	$("#add_item_finish").bind("click", function(){
		var single_checked = $("[name='single']:checked"); // 所有checked元素的陣列
		var add_item_error_msg = Array();
		var single_at_id = Array();
		for(var i = 0; i < single_checked.size(); i++){
			var at_id = $(single_checked[i]).attr("id").replace("at_", "");
			single_at_id.push(at_id);
		}
		if(single_at_id.length == 0){
			single_at_id.push(0);
		}

		mul_at_id = $("[name='mul']:checked").attr("id").replace("at_", "");
		
		
		new_main_series = ($("#new_main_series").val().replace("s_", "")); // .val()取得select中被選取的option的value
		new_main_name = $("#new_main_name").val().replace(/\s/g, ''); // 去除所有空白
		new_main_price = $("#new_main_price").val();
		
		if(new_main_name == ""){
			add_item_error_msg.push("品項名稱不可空白！");
		}
		if(new_main_series=="0"){
			add_item_error_msg.push("請選擇系列！");
		}
		if(new_main_price==""){
			add_item_error_msg.push("品項價格無效！");
		}
		
		if(add_item_error_msg.length == 0){
			$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
				data: {
					"action": "add_item", 
					"single_at_id": single_at_id, 
					"mul_at_id": mul_at_id, 
					"new_main_series": new_main_series, 
					"new_main_name": new_main_name, 
					"new_main_price": new_main_price
				},
				async:false
			})
			.done(function(){
				$("#close_new_main_win").trigger('click');
				$("#series_table").load("edit_menu #series_table > div");
				alertify.success("新增品項成功！");
				series_table_bind();
			})
			.fail(function(){
				alertify.error("新增品項傳輸錯誤！");
			});
		}
		else{
			alertify.error(add_item_error_msg.join("<br>"));
		}
		
	});
	$("#new_main_set").css({"display":"block"});
	
	// 新增細項類別
	$("#add_multi_choice").bind('click', function(){ // 下單時之單選項目
		var new_mul_type;
		backup_to_global();
		alertify.prompt("請輸入新單選細項類別名稱", function(e, new_mul_type) {
			if(e && (new_mul_type != "")) {
				$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {
						"action": "add_additional_type", 
						"option_name":new_mul_type, 
						"multiple_choice":"0"
					},
					async:false
				})
				.done(function(){
					$("#multi_choice").load("edit_menu.php #multi_choice > input + label", function(){
						unbind_new_main_win();
						if($("#new_main_win_h3").text() == '編輯加點項目'){ // 修改編輯加點視窗畫面
							$("#edit_additional").trigger('click');
						}
						else if($("#new_main_win_h3").text() == '編輯品項'){
							$("#" + global_m_id).trigger('click');
							restore_from_global();
						}
						else{
							$("#add_main").trigger('click');
							restore_from_global();
						}
					});
					alertify.success('新增單選細項類別：' + new_mul_type);
				})
				.fail(function(){
					alertify.error("新增品項傳輸錯誤！");
				});				
			}
			else {  
				alertify.error('新增單選細項類別取消！');  
			}  
		}, ""); 
	});
	
	$("#add_single_choice").bind('click', function(){// 下單時之多選項目
		var new_single_type;
		backup_to_global();
		alertify.prompt("請輸入新多選細項類別名稱", function(e, new_single_type) {
			if(e && (new_single_type != "")) {
				$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {
						"action": "add_additional_type", 
						"option_name":new_single_type, 
						"multiple_choice":"1"
					},
					async:false
				})
				.done(function(){
					$("#add_single_choice").load("edit_menu.php #add_single_choice", function(){
						unbind_new_main_win();
						if($("#new_main_win_h3").text() == '編輯加點項目'){ // 修改編輯加點視窗畫面
							$("#edit_additional").trigger('click');
						}
						else if($("#new_main_win_h3").text() == '編輯品項'){
							$("#" + global_m_id).trigger('click');
							restore_from_global();
						}
						else{
							$("#add_main").trigger('click');
							restore_from_global();
						}
					});
					alertify.success('新增多選細項類別：' + new_single_type);
				})
				.fail(function(){
					alertify.error("新增品項傳輸錯誤！");
				});				
			}
			else {  
				alertify.error('新增多選細項類別取消！');  
			}  
		}, ""); 
	});
}

function unbind_new_main_win()
{
	$("#add_item_finish").unbind();
	$("#add_multi_choice").unbind();
	$("#add_single_choice").unbind();
	$("#close_new_main_win").unbind();
}

function close_new_main_win(){
	$("#new_main_set").css({"display":"none"});
	unbind_new_main_win();
	//location.reload(); 
}

function edit_item(){
	
	var s_id = $(this).parents("div").attr('id').replace('s', '');
	var m_id = $(this).attr('id').replace('m', '');
	global_m_id = $(this).attr('id');
	var at_id = $(this).attr('data-at_id');
	var name = $(this).text().replace(/\s/g, ''); // 去除字串中所有空白，英文語系不能去除單字間空白
	var price = $(this).attr('value');
	console.log("s_id: " + s_id);
	console.log("m_id: " + m_id);
	console.log("多選at_id: " + at_id);
	console.log("name: " + name);
	console.log("price: " + price);
	
	// 修改畫面為個別品項編輯用
	$("#add_main").trigger("click");
	$("#new_main_win_h3").text('編輯品項');
	
	// 依品項內容設定畫面
	$('#new_main_series').val('s_' + s_id);
	$('#new_main_name').val(name);
	$('#new_main_price').val(price);
	$("#at_" + at_id).attr("checked", true); // 選取
	
	// 確定按鈕for編輯品項
	var edit_item_submit = $('<button>').attr({"id":"edit_item_submit", "class":"w3-btn w3-right w3-round", "style": "margin:5px"}).text('確定');
	var del_item_submit = $('<button>').attr({"id":"del_item_submit", "class":"w3-btn w3-left w3-round", "style": "margin:5px"}).text('刪除此品項');
	$('#add_item_finish').after(edit_item_submit);
	$('#add_item_finish').after(del_item_submit);
	$('#add_item_finish').hide();
	
	edit_item_submit.bind('click', function(){		
		var single_checked = $("[name='single']:checked"); // 所有checked元素的陣列
		var add_item_error_msg = Array();
		var single_at_id = Array();
		for(var i = 0; i < single_checked.size(); i++){
			var at_id = $(single_checked[i]).attr("id").replace("at_", "");
			single_at_id.push(at_id);
		}
		if(single_at_id.length == 0){
			single_at_id.push(0);
		}

		mul_at_id = $("[name='mul']:checked").attr("id").replace("at_", "");
		
		new_main_series = ($("#new_main_series").val().replace("s_", "")); // .val()取得select中被選取的option的value
		new_main_name = $("#new_main_name").val().replace(/\s/g, ''); // 去除所有空白
		new_main_price = $("#new_main_price").val();
		
		if(new_main_name == ""){
			add_item_error_msg.push("品項名稱不可空白！");
		}
		if(new_main_series=="0"){
			add_item_error_msg.push("請選擇系列！");
		}
		if(new_main_price==""){
			add_item_error_msg.push("品項價格無效！");
		}
		
		if(add_item_error_msg.length == 0){
			
			$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
				data: {
					"action": "edit_item",
					"m_id":m_id,
					"single_at_id": single_at_id, 
					"mul_at_id": mul_at_id, 
					"new_main_series": new_main_series, 
					"new_main_name": new_main_name, 
					"new_main_price": new_main_price
				},
				async:false
			})
			.done(function(){
				$("#close_new_main_win").trigger('click');
				$("#series_table").load("edit_menu.php #series_table > div");
				alertify.success("編輯品項成功！");
				series_table_bind();
			})
			.fail(function(){
				alertify.error("編輯品項傳輸錯誤！");
			});
			
		}
		else{
			alertify.error(add_item_error_msg.join("<br>"));
		}
	});
	
	del_item_submit.bind('click', function(){
		alertify.confirm("確定刪除此品項？", function(e){
			if(e){
				$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {
						"action": "del_item", 
						"m_id": m_id
					},
					async:false
				})
				.done(function(){
					$("#close_new_main_win").trigger('click');
					$("#series_table").load("edit_menu.php #series_table > div");
					alertify.success("刪除品項成功！");
					series_table_bind();
				})
				.fail(function(){
					alertify.error("刪除品項傳輸錯誤！");
				});
			}
			else{
				alertify.error("刪除細項取消！");
			}
		});
	});
	
	$.ajax({
		url:"edit_menu_op.php",
		method: "POST",
		dataType:"json",
		data: {
			"action": "get_ro_for_main", 
			"m_id":m_id
		},
		async:false
	})
	.done(function(ro_data_array){
		console.log(ro_data_array);
		console.log(ro_data_array.length);
			
		for(var i = 0; i < ro_data_array.length; i++)
		{
			console.log("單選at_id: " + ro_data_array[i]['at_id']);
			$("#at_" + ro_data_array[i]['at_id']).attr("checked", true); // 選取
		}
	})
	.fail(function(){
		alertify.error("新增細項傳輸錯誤！");
		edit_item_submit.remove();
	});
}

function del_series(){
	var s_id = $(this).attr('id').replace('del_s_', '');
	console.log('s_id: ' + s_id);
	alertify.confirm("確定要刪除系列「" + $('#es_' + s_id).val() + "」？", function(e){
		if(e){
			
			$.ajax({
				url:"edit_menu_op.php",
				method: "POST",
				dataType:"json",
				data: {
					"action": "del_series", 
					"s_id": s_id
				},
				async:false
			})
			.done(function(main_data_array){
				console.log(main_data_array);
				$("#series_table").load("edit_menu.php #series_table > div");
				alertify.success("刪除系列成功！");
				series_table_bind();
				read_series_for_pre();
			})
			.fail(function(){
				alertify.error("刪除系傳輸錯誤！");
			});
			
		}
		else{
			alertify.error("刪除系列取消！");
		}
	});
}

function main_sortable(){
	var series_table_div = $("#series_table  > div[id^='s']"); // 取得所有系列div
	for(var i = 0; i < series_table_div.size(); i++ ){
		console.log("建立排序清單：" + $(series_table_div[i]).attr('id'));

		var m_sort = Sortable.create(series_table_div[i], { // 建立排序清單
			animation: 200,
			onUpdate: function (evt) {
				console.log('品項排序更新！');
				console.log($(evt.item).parent()); // evt.item為被拖曳物件，利用此物件來找到所屬系列div
				var error_flag = false;
				var m_button = $(evt.item).parent().children("div");
				for(var i = 0; i < m_button.size(); i++){
					var m_id = $(m_button[i]).attr('id').replace('m', '');
					console.log("Order " + i + ": " + m_id);
			
					$.ajax({
						url:"edit_menu_op.php",
						method: "POST",
						dataType:"json",
						data: {
							"action": "main_sort", 
							"m_id": m_id, 
							"order": i
						},
						async:false
					})
					.done(function(){
						
					})
					.fail(function(){
						alertify.error("品項排序傳輸失敗！");
						error_flag = true;
					});
				}
				$("#series_table").load("edit_menu.php #series_table > div");
				if(error_flag)
					alertify.error("品項排序更新失敗...");
				else
					alertify.success("品項排序已更新！");
				series_table_bind();
			},
			draggable: ".w3-btn", // Specifies which items inside the element should be sortable
		});
		global_sort_main_list.push(m_sort);
	}
}

function main_sortable_destroy(){
	console.log('關閉品項排序');
	for(var i = 0; i < global_sort_main_list.length; i++){
		console.log(global_sort_main_list[i]);
		global_sort_main_list[i].destroy();
	}
	global_sort_main_list.length = 0;
}

function series_sortable(){
	console.log('建立系列排序');
	global_sort_series = Sortable.create(document.getElementById("series_table"), { // 建立排序清單
		animation: 200,
		onStart: function (/**Event*/evt) {
			console.log("Series Sort Start");
			main_sortable_destroy();
			$("input[id^='es']").unbind('click');
		},
		onEnd: function (/**Event*/evt) {
			console.log("Series Sort End");
			series_table_bind();
		},
		onUpdate: function (evt) {
			console.log('系列排序更新！');
			var error_flag = false;
			var s_div = $(evt.item).parent().children("div");
			for(var i = 0; i < s_div.size(); i++){
				var s_id = $(s_div[i]).attr('id').replace('s', '');
				console.log("Order " + i + ": " + s_id);
				$.ajax({
					url:"edit_menu_op.php",
					method: "POST",
					dataType:"json",
					data: {
						"action": "series_sort", 
						"s_id": s_id, 
						"order": i
					},
					async:false
				})
				.done(function(){
					
				})
				.fail(function(){
					alertify.error("系列排序傳輸失敗！");
					error_flag = true;
				});
			}
			series_sortable_destroy();
			$("#series_table").load("edit_menu.php #series_table > div");
			if(error_flag)
				alertify.error("系列排序更新失敗...！！");
			else
				alertify.success("系列排序已更新！");
		},
	});
}

function series_sortable_destroy(){
	console.log('關閉系列排序');
	global_sort_series.destroy();
}


function series_table_bind() {
    // 修改
    $("div[id^='m']").not("#main").not("#multi_choice").bind('click', edit_item); // 編輯品項
	$("input[id^='es']").bind('click', edit_series); // 編輯系列名稱

	// 刪除
	$('a[id^=del_s_]').bind('click', del_series); // 刪除系列
	
	// 拖曳排序
	series_sortable();
	main_sortable();
}

$(document).ready(function(){

	$("#add_series").bind("click", add_series);// 新增系列
	
    $("#add_main").bind('click', add_item); // 新增品項
	$("#edit_additional").bind('click', function(){ // 編輯加點項目
		$("#add_main").trigger('click');
		$("#detail_title").hide();
		$("#add_item_finish").hide();
		$("#new_main_win_h3").text('編輯加點項目');
	});
	read_series_for_pre();
	series_table_bind(); // 更新菜單畫面後需重新bind事件
	
});
