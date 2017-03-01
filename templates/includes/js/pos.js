var order_info=new Object();
order_info["share_array"]=[];
order_info["table_num"]="16";
order_info["people_num"]="2";

order_info["share_array"][0]=new Object();
order_info["share_array"][0]["items_array"]=[];
var cache_items = new Array(5);

for (var l=0; l<cache_items.length; ++l){
    cache_items[l] = new Array();
}

var cache_index = 0;
var cache_index_left = cache_items.length-1;
var cache_index_right = cache_index+1;

var one_item_number = 1;
var first_cal_button = true;
var free_flag = true;
var send_order_flag = false;
var click_bitton_flag = false;
var send_check_out_total_amount;

$(document).ready(function(){
        free_flag = true;
        resetAll();
        $("#now_list").text(cache_index);

        $(".calculator").hide();

        $("#nav_open").parent().remove();

        $("button[id^='m']").click(function(){
            var name = $(this)[0].innerHTML;
            var price = parseInt($(this)[0].value);
            var m_id = ($(this)[0].id).slice(1); // slice : m64 ->64
            var comment_name = ($(this).attr("data-series_name")).substr(-2,1);

            //var comment =$('<td>');
            var comment = $('<button>');
            comment.addClass("w3-btn w3-orange");
            comment.text(comment_name);
            comment.val(-1); // for 冷 and 熱
            //comment.append(add_btn);
//console.log(comment.val());
            one_item_number = parseInt($(amount_of_item).text());
            if(one_item_number != 0)
                addRow(name,one_item_number, price, comment, m_id);
            hideCalculator();
        });

        $("input:radio[name='discount']").change(function() {
            console.log($("input[name='discount']:checked").val());
            var price = $("#total_price").val();
            var dis = $("input[name='discount']:checked").val();
            price = parseInt(price * dis);
            $("#check_out_price").val(price);
            $("#check_out_total_amount").val( $("#check_out_price").val() - $("#discount_amount").val());
            $("#check_out_change_price").val( $("#check_out_amount_result").val()- $("#check_out_total_amount").val());
        });

        $("#send_order_button").click(function(){
            if ($("#order_list").find("tr").length <= 1){
                alertify.success("你尚未點選任何品項");
                return;
            }
            $("#order_list").find("tr").each(function(index, value){
                    if (index>=1)  {
                        var item_array= new Object();
                        amount = $(this).find("td").eq(1).text();

                        item_array["quantity"] = $(this).find("td").eq(1).text();
                        if ($(this).find("td").eq(2).text() < 0 )
                            item_array["price"] = "0";
                        else {
                            item_array["price"] = $(this).find("td").eq(2).text();
                        }
                        item_array["comment"] = $(this).find("td").eq(3).text();
                        item_array["m_id"] = $(this).find("td").eq(4).text();
                        item_array["RO_array"] = [];
                        item_array["AI_array"] = [];

                        order_info["share_array"][0]["items_array"].push(item_array);
                    }
                    console.log($(this));
                    console.log($(this).data("item_array"));
                    //alert(order_info["share_array"]["items_array"][0]);
            });
            send_order_flag = true;
            $("#check_out_price").val($("#total_price").val());
            $("#check_out_amount_result").val(0); // type price
            $("#check_out_change_price").val(0);
            $("#check_out_page").css({"display":"block"});
            $("#check_out_total_amount").val( $("#check_out_price").val() - $("#discount_amount").val());
        });

        $("#check_out_button").click(function(){
            $("#check_out_button").attr('disabled', 'disabled');
            checkOut();
            resetAll();
        });

        $("#check_out_close_confirm").click(function(){
            resetAll();
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

        $('.cal_button').click(function(){
          if (send_order_flag == false)
            one_item_number = parseInt($("#amount_of_item").text());
          else {
            if( $("#discount_amount").hasClass("discount_on") )
                one_item_number = $("#discount_amount").val();
            else if ( $("#check_out_amount_result").hasClass("check_out_on") ){
                one_item_number = $("#check_out_amount_result").val();
            }
          }

          switch(this.value){
            case "C":
                one_item_number = 0;
                break;
            case "-1":
                one_item_number = parseInt(one_item_number/10,10);
                break;
            default:
                if(one_item_number == 0 || (one_item_number == 1 && send_order_flag == false))
                  one_item_number = parseInt(this.value);
                else
                  one_item_number = one_item_number*10 + parseInt(this.value);
          }
          if (send_order_flag == false)
            $("#amount_of_item").text(one_item_number);
          else {
              if( $("#discount_amount").hasClass("discount_on") )
                  $("#discount_amount").val(one_item_number);
              else if ( $("#check_out_amount_result").hasClass("check_out_on") )
                  $("#check_out_amount_result").val(one_item_number);

              $("#check_out_total_amount").val( $("#check_out_price").val() - $("#discount_amount").val());
              $("#check_out_change_price").val( $("#check_out_amount_result").val()- $("#check_out_total_amount").val());
          }
        })

        //hidden menu expect first menu
        for (i = 1; i < $(".menu").length; i++) {
           $(".menu")[i].style.display = "none";
        }
        $("#cart_list").css({"display":"block"});
    });

function resetAll() {
    $("button[id^='m']").removeAttr('disabled');
    one_item_number = 1;
    $("#amount_of_item").text("1");
    $("#check_out_page").css({"display":"none"});
    send_order_flag = false;
    $("#check_out_amount_result").addClass("check_out_on");
    $("#discount_amount").removeClass("discount_on");
    $("#discount_amount").val(0);
    send_check_out_total_amount = $("#check_out_total_amount").val();
    $("#check_out_total_amount").val(0);
    $("input:radio[name='discount']").filter('[value="1"]').prop('checked', true);
    click_bitton_flag = false;
}

function openMenu(menuName) {
  var i;
  for (i = 0; i < $(".menu").length; i++) {
     $(".menu")[i].style.display = "none";
  }
  document.getElementById(menuName).style.display = "block";
}

function hideCalculator(){
    $(".calculator").hide();
    $("#table_cart").css("height","66vh");
    one_item_number=1;
    $("#amount_of_item").text("1");
    first_cal_button=true;
}

function showCalculator(){
    if( $('.calculator').is(':visible') ){
        hideCalculator();
    } else {
        $(".calculator").show();
        $("#table_cart").css("height","23vh");
    }
}

function addOneItemAmount(add){
    var haveSelected = false;
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0 ){
            if( $(this).hasClass("selected") )
                haveSelected = true;
        }
    });

    if(haveSelected == false) {
        var number = $('#order_list tbody tr:last').find("td").eq(1);
        var new_number = parseInt(number.text()) + add ;
        if( new_number  > 0)
            number.text(new_number);
    } else {
        $("#order_list").find("tr").each(function(index, value){
            if(index > 0 && $(this).hasClass("selected")){
                var number = $(this).find("td").eq(1);
                var new_number = parseInt(number.text()) + add ;
                if( new_number  > 0)
                    number.text(new_number);
            }
        });
    }
    getFree();
}

function getFree(){
    var free_number;
    var name;
    var price;
    var amount;
    var comment;
    var m_id;
    var total_item_number = 0;

    $("#total_price").val(0);
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0){
            amount = $(this).find("td").eq(1).text();
            price = $(this).find("td").eq(2).text();
            if(price > 0)
                $("#total_price").val( parseInt($("#total_price").val()) + parseInt(price) * amount );
            else
                $("#total_price").val( parseInt($("#total_price").val()) - parseInt(price) * amount );

            if(amount > 0)
                total_item_number += parseInt(amount);
            if(parseInt(price) < 0){
                $(this).find("td").eq(2).text(-price);
                console.log($(this).find("td").eq(0).text() + $(this).find("td").eq(2).text());
            }
            $(this).removeClass("free");
        }
    });
    $("#total_item_number").text("總共 "+ total_item_number  +" 杯 ");
    free_number = parseInt(total_item_number / 6);

    if(free_flag == false || free_number == 0)
        return;

    var arr = [];
    $('#order_list tr').has('td').each(function() {
        var arrayItem = {};
        var i=0;
        $('td', $(this)).each(function(index, item) {
            arrayItem[index] = $(item).html();
        });

        for(i=0; i<arrayItem[1]; i++)
            arr.push(arrayItem);
    });

    arr.sort(function(a,b){
        return parseInt($(b)[0][2]) - parseInt($(a)[0][2]);
    });
    /*$("#order_list").find("tr").each(function(index, value){
        $(this).removeClass('free');
    });*/

    for (var i=0; i<free_number ; ++i){
        name = arr[arr.length-1-i][0];
        price = arr[arr.length-1-i][2];
        comment = arr[arr.length-1-i][3];
        m_id = arr[arr.length-1-i][4];
        var one_free = true;

       $('#order_list tr').has('td').each(function() {
           var arrayItem = {};
           var i=0;
           $('td', $(this)).each(function(index, item) {
               arrayItem[index] = $(item).html();
           });

           if (name == arrayItem[0] &&
               price == arrayItem[2] &&
               comment == arrayItem[3] &&
               m_id == arrayItem[4] &&
               one_free == true){
                   var amount = parseInt($(this).find("td").eq(1).text());
                   one_free = false;

                   if(amount == 1){
                       $(this).find("td").eq(2).text( -price );
                       $(this).remove();
                       //getFree();
                       console.log(free_number);
                   } else {
                       $(this).find("td").eq(1).text( amount -1);
                   }
                   addRow(name, 1, -price, comment, m_id);

           }
       });

        $("#total_price").val( parseInt($("#total_price").val()) - parseInt(price) );
    }
}

function addRow( name, amount, price, custom_comment, m_id){
    var tr_temp = $('<tr>');
    if(price <= 0){
        tr_temp.addClass('free');
    }
    $('#order_list').append(
         tr_temp.append(
                $('<td>').text(name),
                $('<td>').text(amount),
                $('<td>').text(price),
                $('<td>').html(custom_comment),
                $('<td>').text(m_id).hide()
         )
    );

    // if(parseInt(price) > 0){
        var the_button = tr_temp.find("td").eq(3).find("button");
        console.log(the_button.text());
        if (parseInt(the_button.val()) >= 0) { // hot and clod can not remove
            the_button.click(function(){
                var the_price = $(this).closest("tr").find("td").eq(2);
                var btn_price = $(this).val();
                console.log(btn_price);

                if(parseInt(the_price.text()) >= 0)
                    the_price.text( parseInt(the_price.text()) - btn_price );
                else
                    the_price.text( parseInt(the_price.text()) + parseInt(btn_price) );
                click_bitton_flag = true;
                $(this).remove();
                getFree();
            });
        }
        $("material_button").click(function(){
            var the_price = $(this).closest("tr").find("td").eq(2);
            var btn_price = $(this).val();
            console.log(btn_price);

            if(parseInt(the_price.text()) >= 0)
                the_price.text( parseInt(the_price.text()) - btn_price );
            else
                the_price.text( parseInt(the_price.text()) + parseInt(btn_price) );
            click_bitton_flag = true;
            $(this).remove();
            getFree();
        });

        tr_temp.click(function(event) {
            if(click_bitton_flag == false){
                $(this).toggleClass('selected');
            }
            click_bitton_flag = false;
        });
        // Swipe Left
        tr_temp.on("swipeleft",function(){
            price = parseInt($(this).find("td").eq(2).text());
            amount = parseInt($(this).find("td").eq(1).text())
            $("#total_price").val( parseInt($("#total_price").val()) -$(this).find("td").eq(2).text());
            $(this).remove();
            if(amount > 0 )
                getFree();
        });
        // Swipe Right
        tr_temp.on("swiperight",function(){
                $("#total_price").val( parseInt($("#total_price").val()) -$(this).find("td").eq(2).text());
                $(this).find("td").eq(2).text("0");
                $(this).addClass('free');
                free_flag = false;
                getFree();
        });
    // }

    if(price > 0)
        getFree();
}

function load_ajax(at_id_array){
   var at_id = new Object();
   at_id["at_id_array"] = at_id_array;

    $.ajax( {
        url:"get_ai.php",
        method: "POST",
        dataType:"json",
        data: {"at_id":at_id}
    } ) ;

}

function checkOut(){
    if ($("#discount_amount").val() != 0){
        var item_array= new Object();
        item_array["quantity"] = "1";
        item_array["price"] = -$("#discount_amount").val();
        item_array["comment"] = "";
        item_array["m_id"] = "174"; // 折價
        item_array["RO_array"] = [];
        item_array["AI_array"] = [];

        order_info["share_array"][0]["items_array"].push(item_array);
    }

    var dis = $("input:radio[name='discount']:checked").val();
    if(dis != 1){
        var item_array= new Object();
        item_array["quantity"] = "1";
        item_array["price"] = - ($("#total_price").val() - parseInt($("#total_price").val() * dis) );
        item_array["comment"] = "";
        item_array["m_id"] = "173"; // 打折
        item_array["RO_array"] = [];
        item_array["AI_array"] = [];

        order_info["share_array"][0]["items_array"].push(item_array);
    }

    $.ajax( {
        url:"order_response.php",
        method: "POST",
        dataType:"json",
        data: {"order_info":order_info, "req":"confirm_sum"}
        //console.log(order_info.text());
    } )
    .done(function(msg){
        //alertify.success("下單成功!");
        //alert("下單成功!");
        
        //Use FrieFox and install add-ons https://addons.mozilla.org/zh-tw/firefox/addon/js-print-setup/
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
        printPage.document.getElementById('check_out_total_amount').innerHTML =  "總計" + send_check_out_total_amount.toString();
        printPage.document.getElementById('the_time').innerHTML =  msg["time"];
        printPage.document.getElementById('order_id').innerHTML =  "帳單號碼: " + msg["o_id"];
        printPage.document.getElementById('order_number').innerHTML = parseInt(msg["o_id"]) % 100;
        printPage.document.getElementById('shop_info').innerHTML = msg["shop_name"] + " (" + msg["shop_tel"] +")" ;
        printPage.document.write("<script> jsPrintSetup.print(); window.close(); </script>");
        printPage.document.close("</BODY></HTML>");     
        //=======================print hot page end =================================================

         //=======================print 標籤 page start =================================================     
         $("#order_list").find("tr").each(function(index, value){
             if(index > 0 ){
                    var name =     $(this).find("td").eq(0).text();
                    var amount =   $(this).find("td").eq(1).text();
                    var price =    $(this).find("td").eq(2).text();
                    var comment =  $(this).find("td").eq(3).text();
                    var printPage = window.open("", "", "width=0,height=0");
                    var printer = "EPSON TM-L90 Receipt";
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
         //=======================print 標籤 page end =================================================
        //console.log(jsPrintSetup.getPrintersList());
    })
    .fail(function(msg){
        console.log(msg);
        alert("fail2");
    })
    .always(function(){
        $('#order_list tr').has('td').each(function(index, value){
                $(this).remove();
        });
        //$("#total_price").val(0);
        free_flag = true;
        $("#total_item_number").text('總共 0 杯');
        $("#send_order_button").removeAttr('disabled');
        $("#check_out_button").removeAttr('disabled');
        order_info["share_array"][0]["items_array"]=[];
        resetAll();
            /*$("#cart_list").css({"display":"none"});
            $("button[id^='m']").removeAttr('disabled');
            $("#send_order").removeAttr('disabled');*/
    });
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
        cache_index_left = cache_index;
        cache_index = cache_index_right;
        if((cache_index_right+1) % cache_items.length == 0){
            cache_index_right = 0;
        }
        else{
            cache_index_right ++;
        }
    }
    else{
        cache_index_right = cache_index;
        cache_index = cache_index_left;
        if((cache_index_left-1) < 0){
            cache_index_left = cache_items.length -1;
        }
        else{
            cache_index_left --;
        }
    }

    $("#order_list").find("tr").each(function(index, value){
        if(index > 0){
            $(this).remove();
        }
    });
    for (var s=0; s<cache_items[cache_index].length ; ++s){
        $('table tbody').append(
            cache_items[cache_index][s]
        );
    }
    $("#order_list").find("tr").each(function(index, value){
        var amount;
        if(index > 0) {
            $("#total_price").val( parseInt($("#total_price").val()) + parseInt($(this).find("td").eq(2).text()));
            amount = parseInt($(this).find("td").eq(1).text());
            if(amount > 0) {
                $(this).on("swipeleft",function(){
                    $(this).remove();
                    $("#total_price").val( parseInt($("#total_price").val()) -$(this).find("td").eq(2).text());
                    getFree();
                });
                $(this).click(function(event) {
                    $(this).toggleClass('selected');
                });
            }
        }
    });
    getFree();
    $("#now_list").text(cache_index);
}

function passList(name,price){
    var haveSelected = false;
    console.log(name,price);
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0 && $(this).hasClass("selected")){
            haveSelected = true;
            // var the_price = parseInt($(this).find("td").eq(2).text());
            // if(parseInt(the_price) < 0)
            //     $(this).find("td").eq(2).text( -parseInt(the_price) );
        }
        console.log( parseInt($(this).find("td").eq(2).text()));
    });

    if(haveSelected == false){
        // $("#order_list").find("tr").each(function(index, value){
        //     if(index > 0){
        //         var the_price = $(this).find("td").eq(2).text();
        //         if(parseInt(the_price) < 0)
        //             $(this).remove();
        //     }
        // });
        $('#order_list tbody tr:last').addClass("selected");
    }

    $("#order_list").find("tr").each(function(index, value){
        if(index > 0 && $(this).hasClass("selected")){
            var comment = $(this).find("td").eq(3);
            var new_price = $(this).find("td").eq(2);

            //comment.text( comment.text() + ' ' + name);

            add_btn = $('<button>');
            add_btn.addClass("w3-btn w3-orange material_button");
            add_btn.text(name);
            add_btn.val(price);
            comment.append(add_btn);
            console.log(add_btn.val());
            add_btn.click(function(){
                var the_price = $(this).closest("tr").find("td").eq(2);
                var btn_price = $(this).val();
                the_price.text( parseInt(the_price.text()) - btn_price );
                click_bitton_flag = true;
                $(this).remove();
                getFree();
            });

            if($(this).hasClass("free"))
                new_price.text( -parseInt(new_price.text()) + parseInt(price));
            else
                new_price.text( parseInt(new_price.text()) + parseInt(price));
            $(this).removeClass('selected');
        }
    });

    getFree();
}


function removeOrder(){

    $("#remove_modal").show();

   $("#order_list tbody tr").remove();

    $.ajax( {
        url:"pos_remove_request.php",
        method: "POST",
        dataType:"json",
        data: {"re_request":"1"}
        //console.log(order_info.text());
    } )
    .done(function(msg){

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

    });
    mod_btn.text('修改');
    mod_btn.click(function(){

        //$("#remove_table").find("tr").each(function(index, value){
        var mod_o_id = $(this).parent().parent().children().html();
        var mod_target_text = $(".rm_text"+mod_o_id);
        var mod_target_quantity = $(".rm_quantity"+mod_o_id);
        var mod_target_price = $(".rm_price"+mod_o_id);
        var mod_target_comment = $(".rm_comment"+mod_o_id);

        for(var j =0; j < mod_target_text.length; ++j){

            addRow( mod_target_text.eq(j).html(), mod_target_quantity.eq(j).html(), mod_target_price.eq(j).html(), mod_target_comment.eq(j).html(), '');
        //addRow( name, amount, price, custom_comment, m_id)
        }
        $("#remove_table tbody tr").remove();
        $("#remove_modal").hide();
    });

    for(var i =0 ;i< order_array.length; ++i){

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


$(document).on('click','#remove_times',function(){
   $("#remove_table tbody tr").remove();
   $("#remove_modal").hide();

});

$(document).on('click','#confirm_times',function(){
   $("#confirm_modal").hide();
   $("#remove_table tbody tr").remove();

});
