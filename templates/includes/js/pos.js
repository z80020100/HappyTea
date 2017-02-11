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

$(document).ready(function(){
        free_flag = true;
        $("#now_list").text(cache_index);

        $(".calculator").hide();

        $("#nav_open").parent().remove();

        $("button[id^='m']").click(function(){
            var name = $(this)[0].innerHTML;
            var price = parseInt($(this)[0].value);
            one_item_number = parseInt($(amount_of_item).text());
            if(one_item_number != 0)
                addRow(name,one_item_number, price);
            hideCalculator();
        });

        $("#send_order_button").click(function(){
            if ($("#order_list").find("tr").length <= 1){
                alertify.success("你尚未點選任何品項");
                return;
            }
            $("#order_list").find("tr").each(function(index, value){
                    order_info["share_array"][0]["items_array"].push($(this).data("item_array"));
            });
            $("#check_out_price").val($("#total_price").val());
            $("#check_out_amount_result").text("0"); // type price
            $("#check_out_change_price").val(0);
            $("#check_out_page").css({"display":"block"});
        });

        $("#check_out_button").click(function(){
            $("#check_out_button").attr('disabled', 'disabled');
            checkOut();
            resetAll();
        });

        $("#check_out_close_confirm").click(function(){
            resetAll();
        });

        $('.cal_button').click(function(){
          if(first_cal_button){
            first_cal_button = false;
            one_item_number = 0;
          }
          switch(this.value){
            case "C":
                one_item_number = 0;
                break;
            case "-1":
                one_item_number = parseInt(one_item_number/10,10);
                break;
            default:
                if(one_item_number == 0)
                  one_item_number = parseInt(this.value);
                else
                  one_item_number = one_item_number*10 + parseInt(this.value);
          }
          $("#amount_of_item").text(one_item_number);
          $("#check_out_amount_result").text(one_item_number);
          $("#check_out_change_price").val(one_item_number-$("#check_out_price").val());
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
        if(index > 0 && $(this).hasClass("selected")){
            haveSelected = true;
        }
    });

    if(haveSelected == false) {
        var number = parseInt($("#amount_of_item").text());
        if( (number+add) > 0)
            number += add;
        $("#amount_of_item").text(number);
    } else {
        $("#order_list").find("tr").each(function(index, value){
            if(index > 0 && $(this).hasClass("selected")){
                var number = $(this).find("td").eq(1);
                console.log(number);
                console.log(add);
                var new_number = parseInt(number.text()) + add ;
                if( new_number  > 0)
                    number.text(new_number);
            }
        });
        getFree();
    }
}

function getFree(){
    var free_number;
    var name;
    var price;
    var amount;
    var comment;
    var total_item_number = 0;
    
    $("#total_price").val(0);
    $("#order_list").find("tr").each(function(index, value){
        if(index > 0){
            amount = $(this).find("td").eq(1).text();
            price = $(this).find("td").eq(2).text();
            if(amount > 0)
                total_item_number += parseInt(amount);
            if(parseInt(price) < 0){
                $(this).remove();
            }else {
                $("#total_price").val( parseInt($("#total_price").val()) + parseInt(price) * amount );
            }
        }
    });
    $("#total_item_number").text("總共 "+ total_item_number  +" 杯 ");
    free_number = parseInt(total_item_number / 6);
    
    if(free_flag == false)
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
    $("#order_list").find("tr").each(function(index, value){
        $(this).removeClass('free');
    });

    for (var i=0; i<free_number ; ++i){
        name = arr[arr.length-1-i][0];
        price = arr[arr.length-1-i][2];
        comment = arr[arr.length-1-i][3];
        addRow(name, -1, -price, comment);
        $("#total_price").val( parseInt($("#total_price").val()) - parseInt(price) );
    }
}

function addRow( name, amount, price){
    addRow( name, amount, price, "");
}

function addRow( name, amount, price, custom_comment){
    var tr_temp = $('<tr>');
    if(amount < 0)
        tr_temp.addClass('free');

    $('table tbody').append(
         tr_temp.append(
                $('<td>').text(name),
                $('<td>').text(amount),
                $('<td>').text(price),
                $('<td>').text(custom_comment)
         )
    );

    if(parseInt(price) > 0){
        tr_temp.click(function(event) {
            $(this).toggleClass('selected');
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
    }
    // Swipe Right
    tr_temp.on("swiperight",function(){
            $("#total_price").val( parseInt($("#total_price").val()) -$(this).find("td").eq(2).text());
            $(this).find("td").eq(2).text("0");
            $(this).addClass('free');
            free_flag = false;
            getFree();
    });

    if(amount > 0)
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
    $.ajax( {
        url:"order_response.php",
        method: "POST",
        dataType:"text",
        data: {"order_info":order_info, "req":"confirm_sum"}
    } )
    .done(function(msg){
        alertify.success("下單成功!");
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
        $("#send_order_button").removeAttr('disabled');
        $("#check_out_button").removeAttr('disabled');
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
        }
    });

    if(haveSelected == false){
        $("#order_list").find("tr").each(function(index, value){
            if(index > 0){
                var the_price = $(this).find("td").eq(2).text();
                if(parseInt(the_price) < 0)
                    $(this).remove();
            }
        });
        $('#order_list tbody tr:last').addClass("selected");
    }

    $("#order_list").find("tr").each(function(index, value){
        if(index > 0 && $(this).hasClass("selected")){
            var comment = $(this).find("td").eq(3);
            var new_price = $(this).find("td").eq(2);

            comment.text( comment.text() + ' ' + name);
            if($(this).hasClass("free"))
                new_price.text("0");
            else
                new_price.text( parseInt(new_price.text()) + parseInt(price));
            $(this).removeClass('selected');
        }
    });

    getFree();
}
