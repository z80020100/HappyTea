var order_info=new Object();
order_info["share_array"]=[];
order_info["table_num"]="16";
order_info["people_num"]="2";
order_info["in_or_out"]="";
order_info["discount_ratio"]="";
order_info["discount_amount"]="";
order_info["check_out_total_amount"]="";

order_info["share_array"][0]=new Object();
order_info["share_array"][0]["items_array"]=[];
var number_cache_order = 3 ;
var cache_items = new Array(number_cache_order);

for (var l=0; l<cache_items.length; ++l){
    cache_items[l] = new Array();
}

var cache_index = 0;

var main_name2id= [];
var main_id2name= [];
var material_name2id= [];
var cal_button_buffer='';


$(document).ready(function(){
        $("#current_order").text(cache_index + 1);


        buildMapTable();

        $("#order_button").click(function(){
            if ($("#order_list").find("tr").length <= 1){
                alert('你尚未點選任何品項');
                //alertify.success("你尚未點選任何品項");
                return;
            }


            $("#order_list").find("tr").each(function(index, value){
                if (index>=1)  {
                    var item_array= new Object();



                    item_array['name'] = $(this).find("td").eq(0).text();
                    item_array["quantity"] = $(this).find("td").eq(1).text();
                    item_array["price"] = $(this).find("td").eq(2).text();

                    if($(this).find("td").eq(0).text().indexOf('S') > -1){
                        item_array["volume"] = 1;
                    }else if($(this).find("td").eq(0).text().indexOf('M') > -1){
                        item_array["volume"] = 2;

                    }else if($(this).find("td").eq(0).text().indexOf('L') > -1){
                        item_array["volume"] = 3;

                    }else{
                        item_array["volume"] = 0;

                    }



                    item_array['comment'] = [];

                    var button_length = $(this).find('td').eq(3).find('button').length;
                    for(var i =0; i< button_length ; ++i){
                        item_array["comment"].push($(this).find('td').eq(3).find('button').eq(i).text());
                       // alert($(this).find('td').eq(3).find('button').eq(i).text());
                    }

                    item_array["RO_array"] = [];
                    item_array["AI_array"] = [];

                    order_info["share_array"][0]["items_array"].push(item_array);
                }
                //console.log(order_info["share_array"][0]["items_array"]);
            });
            $("#check_out_page").css({"display":"block"});
            $("#check_out_price").val($("#total_price").val());
            $("#check_out_amount_result").val(0); // type price
            $("#check_out_change_price").val(0);
            $("#check_out_total_amount").val( $("#check_out_price").val() - $("#discount_amount").val());
            updateCheckOut();

        });

        $("#check_out_close_confirm").click(function(){
            removeOrderList();
            calOrderPrice();
            $("input[name='discount'][value='1']").prop('checked', 'checked');
            $("input[name='inorout'][value='drink_in']:radio").click();
            $("#discount_amount").val(0);
            $("#check_out_page").css({"display":"none"});

            // add clean order info

        });

        $(".checkout_cal_button").click(function(){


            if($("#discount_amount").hasClass("discount_on") == true ){
                temp_input = $("#discount_amount");
            }else{
                temp_input = $("#check_out_amount_result");

            }

            if(temp_input.val() == 0){

                if($(this).val() != 'C' && $(this).val() != '-1'){
                    temp_input.val($(this).val());

                }

            }else{

                if($(this).val() == 'C'){
                    temp_input.val(0);
                }else if($(this).val() == '-1'){

                    var temp_value = temp_input.val();
                    if(temp_value.length == 1){

                        temp_input.val(0);
                    }else{
                        temp_value = temp_value.slice(0, -1)
                        temp_input.val(temp_value);
                    }

                }else{

                    temp_input.val(temp_input.val() + $(this).val());
                }

            }
            updateCheckOut();

        });

        $("#discount_amount").click(function(){
            if( $("#discount_amount").hasClass("discount_on") == false){
                $("#discount_amount").addClass("discount_on");
                $("#check_out_amount_result").removeClass("check_out_on");
            }

        });


        $("#check_out_amount_result").click(function(){
            if( $("#check_out_amount_result").hasClass("check_out_on") == false ){
                $("#check_out_amount_result").addClass("check_out_on");
                $("#discount_amount").removeClass("discount_on");
            }
        });


        $("#check_out_button").click(function(){

            checkOut();
            $("#check_out_button").attr('disabled', 'disabled');
            //$("#check_out_close_confirm").click();


        });

        $("input:radio[name='discount']").change(function() {
            updateCheckOut();
        });


        $("#calculator_panel").click(function(){

            if( $('#calculator_number').is(':visible') ){
                $("#table_cart").css("height","66vh");

            } else {
                $("#table_cart").css("height","23vh");
            }

            $("#calculator_number").toggle();

        });

        $("#staff_report").click(function(){
            $("#report_modal").show();
            requestReport();

        });
        $("#report_times").click(function(){
            $("#report_modal").hide();

        });

        $('.cal_button').click(function(){
            if($(this).val() == 'C'){
                cal_button_buffer = '';
            }
            else if($(this).val() == '-1'){
                cal_button_buffer = cal_button_buffer.substring(0, cal_button_buffer.length-1);

            }else{
                cal_button_buffer = cal_button_buffer + $(this).val();
            }

        });

        $('.add_one').click(function(){

            if($('.selected_row').length == 0){


                var order_length = $("#order_list tr").length;
                var temp_quantity = $("#order_list").find("tr").eq(order_length-1).find('td').eq(1).text();
                temp_quantity = parseInt(temp_quantity) + 1;
                $("#order_list").find("tr").eq(order_length-1).find('td').eq(1).text(temp_quantity);
            }
            else{
                $('.selected_row').each(function(index, value){

                    var temp_quantity =  $(this).find("td").eq(1).text();
                    temp_quantity = parseInt(temp_quantity) + 1;
                    $(this).find("td").eq(1).text(temp_quantity);
                    $(this).removeClass('selected_row');

                });
            }
            calOrderPrice();


        });

        $('.minus_one').click(function(){

            if($('.selected_row').length == 0){


                var order_length = $("#order_list tr").length;
                var temp_quantity = $("#order_list").find("tr").eq(order_length-1).find('td').eq(1).text();

                if(temp_quantity > 1){
                    temp_quantity = parseInt(temp_quantity) - 1;
                    $("#order_list").find("tr").eq(order_length-1).find('td').eq(1).text(temp_quantity);
                }
            }
            else{
                $('.selected_row').each(function(index, value){

                    var temp_quantity =  $(this).find("td").eq(1).text();
                    temp_quantity = parseInt(temp_quantity) -1 ;

                    if(temp_quantity > 1){
                        $(this).find("td").eq(1).text(temp_quantity);
                    }

                    $(this).removeClass('selected_row');

                });
            }
            calOrderPrice();


        });


        $("button[id^='m']").click(function(){
            var name = $(this)[0].innerHTML;
            var unit_price = parseInt($(this)[0].value);
            var m_id = ($(this)[0].id).slice(1); // slice : m64 ->64
            var comment_name = ($(this).attr("data-series_name")).substr(-2,1);

            if(cal_button_buffer == ''){

                addRow(name, 1, unit_price, "");
                if( $('#calculator_number').is(':visible') ){
                    cal_button_buffer = '';
                    $("#calculator_panel").click();
                }

            }else{
                addRow(name, cal_button_buffer, unit_price, "");
                cal_button_buffer = '';
                $("#calculator_panel").click();
            }
            calOrderPrice();

        });

        $("button[id^='s']").click(function(){
            display_part = $(this).attr('id') + "_display";
            $(".menu").hide();
            $("#"+display_part).show();
        });

        $(".addition_button").click(function(){

            var addition_name = $(this).data()['name'];
            var addition_price = $(this).data()['price'];

            if($('.selected_row').length == 0){

                var add_btn = $('<button>');
                add_btn.text(addition_name);
                add_btn.data('price', addition_price);
                add_btn.click(function(){
                    $(this).remove();
                    calOrderPrice();
                });

                var order_length = $("#order_list tr").length;
                $("#order_list").find("tr").eq(order_length-1).find('td').eq(3).append(add_btn);
            }
            else{
                $('.selected_row').each(function(index, value){
                    var add_btn = $('<button>');
                    add_btn.text(addition_name);
                    add_btn.data('price', addition_price);
                    add_btn.click(function(){
                        $(this).remove();
                        calOrderPrice();
                    });

                    $(this).find("td").eq(3).append(add_btn);
                    $(this).removeClass('selected_row');

                });
            }
            calOrderPrice();
        });


});


function addRow( name, amount, price, custom_comment){

    var tr_temp = $('<tr>');
    $('#order_list').append(
         tr_temp.append(
                $('<td>').text(name),
                $('<td>').text(amount),
                $('<td>').text(price),
                $('<td>').html(custom_comment)
         )
    );

    tr_temp.on("swipeleft",function(){
        $(this).remove();
        calOrderPrice();
    });
    // Swipe Right
    tr_temp.on("swiperight",function(){
    });

    tr_temp.click(function(event) {
        $(this).toggleClass('selected_row');
    });

    return;
}


function calOrderPrice(){

    var sum=0;
    $('#order_list tr').each(function(index, value){
        if(index > 0){
            var button_length = $(this).find('td').eq(3).find('button').length;
            for(var i =0; i< button_length ; ++i){
                var temp_price = $(this).find('td').eq(3).find('button').eq(i).data('price');
                sum = sum + parseInt(temp_price) * parseInt($(this).find("td").eq(1).text());
                //alert($(this).find('td').eq(3).find('button').eq(i).text());
                //alert(temp_price);
            }
            sum = sum +parseInt($(this).find("td").eq(2).text()) * parseInt($(this).find("td").eq(1).text());
        }
    });

    $("#total_price").val(sum);

    return;
}


function removeOrderList(){
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0){
            $(this).remove();
        }
    });

    return;
}



$(document).on('click','#previous_order',function(){
    cacheList(0);
});

$(document).on('click','#next_order',function(){
    cacheList(1);
});


function buildMapTable(){

    $("button[id^='m']").each(function(index, value){
        //main_name2id[$(this)[0].innerHTML] = $(this).attr('id');
        main_name2id[$(this).text()] = $(this).attr('id');

    });
    $(".addition_button").each(function(index, value){
        material_name2id[$(this).data('name')] = $(this).attr('id');

    });
    return;
}

function clickItem(name, is_main){

    if(is_main == 1){
        $('#'+main_name2id[name]).click();
    }else{
       // alert(name);
        //alert(material_name2id[name]);
        $('#'+material_name2id[name]).click();
    }
    return;
}



function cacheList(isRight){


    $("#total_price").val(0);
    cache_items[cache_index].length = 0;
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0){
           cache_items[cache_index].push(value);
        }
    });


    if(parseInt(isRight) == 1){
        cache_index = cache_index + 1;
        if(cache_index > number_cache_order - 1){
            cache_index = 0;
        }
    }else{
        cache_index = cache_index - 1;
        if(cache_index < 0){
            cache_index = number_cache_order - 1;
        }

    }

    removeOrderList();

    for(var s=0; s<cache_items[cache_index].length ; ++s){
        temp_row = cache_items[cache_index][s];
       // alert($(temp_row).find('td').eq(3).find('button').eq(0).text());
        clickItem($(temp_row).find('td').eq(0).text(), 1);
        for(var j = 0 ; j < $(temp_row).find('td').eq(3).find('button').length ; ++j){
            var temp_material = $(temp_row).find('td').eq(3).find('button').eq(j).text();
            clickItem(temp_material, 0);

        }


    }


    $("#current_order").text(cache_index + 1);
    calOrderPrice();


    return;
}

function updateCheckOut(){
    //alert($("input:radio[name='discount']:checked").val());
    discount_ratio = $("input:radio[name='discount']:checked").val();
    temp_check_out_price = $('#total_price').val();
    $('#check_out_price').val(temp_check_out_price * discount_ratio);
    $('#check_out_total_amount').val($('#check_out_price').val() - $('#discount_amount').val());
    //alert($('#discount_amount').val());

    temp_change_price = $('#check_out_amount_result').val() - $('#check_out_total_amount').val();
    $('#check_out_change_price').val(temp_change_price);

    return;
}


$(document).on('click','#remove_times',function(){
   $("#remove_table tbody tr").remove();
   $("#remove_modal").hide();

});

$(document).on('click','#confirm_times',function(){
   $("#confirm_modal").hide();
   $("#remove_table tbody tr").remove();

});



function removeOrder(){

   $("#remove_modal").show();

    removeOrderList();
    $.ajax( {
        url:"pos_remove_request.php",
        method: "POST",
        dataType:"json",
        data: {"re_request":"1"}
        //console.log(order_info.text());
    } )
    .done(function(msg){

        //console.log(msg[0]['comment']);
        var order_array = [];
        order_array.push(msg[0]);
        for(var i=1; i<msg.length; ++i){
            if(msg[i]['o_id'] == msg[i-1]['o_id']){
                order_array.push(msg[i]);
            }else{

                addRemoveRow(order_array);
                order_array = [];
                order_array.push(msg[i]);
            }
            if(i == msg.length -1){
                addRemoveRow(order_array);

            }
        }

       calOrderPrice();
    })
    .fail(function(){
    })
    .always(function(){
    });

    return;
}


function addRemoveRow( order_array){

    var rm_btn = $('<button>');
    var mod_btn = $('<button>');

    rm_btn.text('刪除');
    rm_btn.click(function(){
       $("#remove_modal").hide();
       $("#confirm_modal").show();
        removeOrderDB($(this).parent().prev().prev().prev().prev().prev().text(), 1);
    });

    mod_btn.text('修改');
    mod_btn.click(function(){

        var mod_o_id = $(this).parent().parent().children().html();
        var mod_target_text = $(".rm_text"+mod_o_id);
        var mod_target_quantity = $(".rm_quantity"+mod_o_id);
        var mod_target_price = $(".rm_price"+mod_o_id);
        var mod_target_comment = $(".rm_comment"+mod_o_id);

        for(var j =0; j < mod_target_text.length; ++j){

            addRow( mod_target_text.eq(j).html(), mod_target_quantity.eq(j).html(), mod_target_price.eq(j).html(), mod_target_comment.eq(j).html());
        }
        $("#remove_table tbody tr").remove();
        $("#remove_modal").hide();
        removeOrderDB($(this).parent().prev().prev().prev().prev().prev().text(), 0);
        calOrderPrice();
    });



    for(var i =0 ;i< order_array.length; ++i){

        //var total_comment ='';
        //for(j=0; j<order_array[i]['comment'].length ; ++j){
        //    total_comment = total_comment + order_array[i]['comment'][j];
        //}


        var tr_temp = $('<tr>');
        if(i==0){
            $('#remove_table').append(
                 tr_temp.append(
                        $('<td>').attr('rowspan',order_array.length).text(order_array[i]['o_id']),
                        $('<td>').addClass("rm_text"+order_array[i]['o_id']).text(order_array[i]['m_text']),
                        $('<td>').addClass("rm_quantity"+order_array[i]['o_id']).text(order_array[i]['quantity']),
                        $('<td>').addClass("rm_price"+order_array[i]['o_id']).text(order_array[i]['price']),
                        $('<td>').addClass("rm_comment"+order_array[i]['o_id']).text(''),
                        $('<td>').attr('rowspan',order_array.length).append(mod_btn, rm_btn)
                 )
            );
        }else{
            $('#remove_table').append(
                 tr_temp.append(
                        $('<td>').addClass("rm_text"+order_array[i]['o_id']).text(order_array[i]['m_text']),
                        $('<td>').addClass("rm_quantity"+order_array[i]['o_id']).text(order_array[i]['quantity']),
                        $('<td>').addClass("rm_price"+order_array[i]['o_id']).text(order_array[i]['price']),
                        $('<td>').addClass("rm_comment"+order_array[i]['o_id']).text('')
                 )
            );

        }
    }


    return;
}



function checkOut(){


    order_info["discount_ratio"]= $("input:radio[name='discount']:checked").val();
    order_info["discount_amount"]= $("#discount_amount").val();

    order_info["check_out_total_amount"]= $("#check_out_total_amount").val();

    if($("input:radio[name='inorout']:checked").val() == 'drink_in'){

        order_info['in_or_out'] = 1 ;
    }else if($("input:radio[name='inorout']:checked").val()  == 'drink_out'){

        order_info['in_or_out'] = 2 ;
    }

   // console.log(order_info);
    $.ajax( {
        url:"order_response.php",
        method: "POST",
        dataType:"json",
        data: {"order_info":order_info, "req":"confirm_sum"}
    } )
   .done(function(msg){
        // send order
        // please put printer function here

        //printReceipt(msg);
        //printLabel();

        console.log(msg);
        console.log('success');
        removeOrderList();
        $("#check_out_close_confirm").click();


    })
    .fail(function(msg){
        console.log(msg);
        alert("結帳失敗");
    })
    .always(function(){

     //   $("#total_item_number").text('總共 0 杯');
        $("#check_out_button").removeAttr('disabled');
        order_info["share_array"][0]["items_array"]=[];
    });

    return;
}


function printLabel(){

    $("#order_list").find("tr").each(function(index, value){
        console.log(value);
        if(index > 0 ){
               var name =     $(this).find("td").eq(0).text();
               var amount =   $(this).find("td").eq(1).text();
               var price =    $(this).find("td").eq(2).text();
               var comment =  $(this).find("td").eq(3).text();
               var printPage = window.open("", "", "width=0,height=0");
               var printer = "Adobe PDF";
               printPage.resizeTo(0,0);
               printPage.moveTo(0,window.screen.availHeight+10);
               var html = "<!DOCTYPE html><HTML><head></head><BODY>";
               var script = "<script> jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation); jsPrintSetup.setOption('printSilent', 1);" +
                           "jsPrintSetup.setShowPrintProgress(false);" + "jsPrintSetup.setOption('marginTop', 0); jsPrintSetup.setOption('marginBottom', 0);" +
                           "jsPrintSetup.setOption('marginLeft', 0); jsPrintSetup.setOption('marginRight', 0);" +
                           "jsPrintSetup.setPrinter(\"" + printer + "\");" +
                           "</script>";
               printPage.document.write( html + script);

               var html = "<span style=\"font-size:20px;padding: 0px 0px 0px 0px;\" id=\"name\"></span>" +
                           "<div style=\"font-size:14px;padding: 0px 0px 0px 0px;\" id=\"price\"></div>" +
                           "<div style=\"font-size:12px;padding: 0px 0px 0px 0px;\" id=\"comment\"></div>";
               printPage.document.write( html );
               printPage.document.getElementById('name').innerHTML =  name;
               printPage.document.getElementById('price').innerHTML =  price + "元";
               printPage.document.getElementById('comment').innerHTML =  comment + "&nbsp";
               printPage.document.write("<script> jsPrintSetup.print(); window.close(); </script>");
        }
    });

    return;
}

function printReceipt(msg){

    //=======================print hot page start =================================================
    var order_list_html = $("#order_list").html();
    var printPage = window.open("", "", "width=0,height=0");
    var printer = "Adobe PDF";
    printPage.resizeTo(0,0);
    printPage.moveTo(0,window.screen.availHeight+10);
    var html = "<!DOCTYPE html><HTML><head></head><BODY>";
    var script = "<script> jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation); jsPrintSetup.setOption('printSilent', 1);" +
               "jsPrintSetup.setShowPrintProgress(false);" + "jsPrintSetup.setOption('marginTop', 0); jsPrintSetup.setOption('marginBottom', 0);" +
               "jsPrintSetup.setOption('marginLeft', 0); jsPrintSetup.setOption('marginRight', 0);" +
               "jsPrintSetup.setPrinter(\"" + printer + "\");" +
               "</script>";
    printPage.document.write( html + script);

    html = "<span>牌號&nbsp&nbsp<span id=order_number style=\"font-size:60px;\"></span></span><br>" +
       "<span style=\"font-size:12px;padding: 0px 0px 0px 0px;\" id=\"shop_info\"></span>" +
       "<div style=\"font-size:12px;padding: 0px 0px 0px 0px;\" id='order_id'>帳單號碼:</div><div style=\"font-size:12px;\" id ='the_time'></div>" +
       "<table id='orderList' style=\"font-size:12px; width:250px\"></table>" +
       "<h5 id='check_out_price'>合計</h5>" +
       "<h5 id='check_out_total_amount'>總計</h5>";
    printPage.document.write( html );
    printPage.document.getElementById('orderList').innerHTML = order_list_html;
    printPage.document.getElementById('check_out_price').innerHTML =  "合計" + $("#total_price").val().toString();
    printPage.document.getElementById('check_out_total_amount').innerHTML =  "總計" + $("#check_out_total_amount").val();
    printPage.document.getElementById('the_time').innerHTML =  "2017-03-04 12:55:6";
    printPage.document.getElementById('order_id').innerHTML =  "帳單號碼: " + msg[1];
    printPage.document.getElementById('order_number').innerHTML = parseInt(msg[1]) % 100;
    printPage.document.getElementById('shop_info').innerHTML = msg[0]["shop_name"] + " (" + msg[0]["shop_tel"] +")" ;
    printPage.document.write("<script> jsPrintSetup.print(); window.close(); </script>");
    printPage.document.close("</BODY></HTML>");
    //=======================print hot page end =================================================



    return;
}

function removeOrderDB(o_id, is_remove_button){
    $.ajax( {
        url:"pos_remove_order.php",
        method: "POST",
        dataType:"json",
        data: {"o_id":o_id}
    } )
   .done(function(msg){
        // send order
       // console.log(msg);
       // console.log('success');
    })
    .fail(function(msg){
        alert("刪除失敗");
    })
    .always(function(){
        if(is_remove_button == 1){
            location.reload();
        }
    });

    return;
}

function requestReport(){
    $.ajax( {
        url:"pos_request_report.php",
        method: "POST",
        dataType:"json",
        data: {"req":'1'}
    } )
   .done(function(msg){
        // send order
        console.log(msg);
       // console.log('success');
    })
    .fail(function(msg){
        alert("刪除失敗");
    })
    .always(function(){

    });

    return;
}
