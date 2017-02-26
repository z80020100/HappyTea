var order_info=new Object();
order_info["share_array"]=[];
order_info["table_num"]="16";
order_info["people_num"]="2";

order_info["share_array"][0]=new Object();
order_info["share_array"][0]["items_array"]=[];
var cache_items = new Array(3);

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
console.log(comment.val());
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
        if (parseInt(the_button.val()) >= 0) { // hot and clod can not remove
            the_button.click(function(){
                var the_price = $(this).closest("tr").find("td").eq(2);
                var btn_price = $(this).val();

                if(parseInt(the_price.text()) >= 0)
                    the_price.text( parseInt(the_price.text()) - btn_price );
                else
                    the_price.text( parseInt(the_price.text()) + parseInt(btn_price) );
                click_bitton_flag = true;
                $(this).remove();
                getFree();
            });
        }

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
        dataType:"text",
        data: {"order_info":order_info, "req":"confirm_sum"}
        //console.log(order_info.text());
    } )
    .done(function(msg){
        //alertify.success("下單成功!");
        //alert("下單成功!");
        console.log(msg);
        // var value = document.getElementById("orderList").innerHTML;
        // var printPage = window.open("", "", "width=200,height=100");
        //  //printPage.document.open();
        //
        //  printPage.resizeTo(0,0);
        //  printPage.moveTo(0,window.screen.availHeight+10);
        //  printPage.document.write("<HTML><head></head><BODY onload='window.print(); window.close();'><table id='orderList'></table>");
        //  printPage.document.write("<PRE>");
        //  printPage.document.getElementById('orderList').innerHTML = value;
        //  printPage.document.write("</PRE>");
        //  printPage.document.close("</BODY></HTML>");
         // console.log(printPage);
        //$.print("#order_list");
        jsPrintSetup.setPrinter("Adobe PDF");
        // set portrait orientation
   jsPrintSetup.setOption('orientation', jsPrintSetup.kPortraitOrientation);
   // set top margins in millimeters
   jsPrintSetup.setOption('marginTop', 15);
   jsPrintSetup.setOption('marginBottom', 15);
   jsPrintSetup.setOption('marginLeft', 20);
   jsPrintSetup.setOption('marginRight', 10);
   // set page header
   jsPrintSetup.setOption('headerStrLeft', 'My custom header');
   jsPrintSetup.setOption('headerStrCenter', '');
   jsPrintSetup.setOption('headerStrRight', '&PT');
   // set empty page footer
   jsPrintSetup.setOption('footerStrLeft', '');
   jsPrintSetup.setOption('footerStrCenter', '');
   jsPrintSetup.setOption('footerStrRight', '');
   // clears user preferences always silent print value
   // to enable using 'printSilent' option
   jsPrintSetup.clearSilentPrint();
   // Suppress print dialog (for this context only)
   jsPrintSetup.setOption('printSilent', 1);
   // Do Print
   // When print is submitted it is executed asynchronous and
   // script flow continues after print independently of completetion of print process!
   jsPrintSetup.print();
   // next commands

        console.log(jsPrintSetup.getPrinter());
        //jsPrintSetup.setPrinter("PdC Printer");
        //jsPrintSetup.print();
         //$('#order_list').print();
         //window.print();
    })
    .fail(function(){
        alert("fail2");
    })
    .always(function(){
        $('#order_list tr').has('td').each(function(index, value){
                $(this).remove();
        });
        $("#total_price").val(0);
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
        if(index > 0)
            cache_items[cache_index].push(value);
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
        if(index > 0)
            $(this).remove();
    });
    for (var s=0; s<cache_items[cache_index].length ; ++s){
        $('table tbody').append(
            cache_items[cache_index]
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
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0 && $(this).hasClass("selected")){
            haveSelected = true;
            // var the_price = parseInt($(this).find("td").eq(2).text());
            // if(parseInt(the_price) < 0)
            //     $(this).find("td").eq(2).text( -parseInt(the_price) );
        }
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
            add_btn.addClass("w3-btn w3-orange");
            add_btn.text(name);
            add_btn.val(price);
            comment.append(add_btn);

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

    $.ajax( {
        url:"pos_remove_request.php",
        method: "POST",
        dataType:"text",
        data: {"re_request":"1"}
        //console.log(order_info.text());
    } )
    .done(function(msg){
        //alertify.success("下單成功!");
        //alert("下單成功!");
        //alert(msg);
        //for(var i=0; i<msg.length; ++i){
        //    addRemoveRow('',msg[i].);
        //}
        console.log(msg);

    })
    .fail(function(){
    })
    .always(function(){
    });

    return;
}



function addRemoveRow( order_number, item, quantity, order_price, comment){
    var tr_temp = $('<tr>');

    $('#remove_table').append(
         tr_temp.append(
                $('<td>').text(order_number),
                $('<td>').text(item),
                $('<td>').text(quantity),
                $('<td>').text(order_price),
                $('<td>').text(comment),
                $('<button').text("1234")
         )
    );


}
