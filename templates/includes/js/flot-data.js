$(document).ready(function() {


//    var start = '2016-01-01 00:00:00';
//    var end = '2018-01-01 23:59:59';
    //var shop = 1;
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var start = curr_year+'-'+(curr_month+1)+'-'+curr_date+' '+'00:00:00';
    var end = curr_year+'-'+(curr_month+1)+'-'+(curr_date+1)+' '+'23:59:59';

    //var req = queryLog(start, end);
    var req;
    // console.log(JSON.stringify(req));


    getData(req);

//    $('#dataTable').DataTable({
//        responsive: true,
//        bInfo: false,
//    });


    $("#search_report").click(function(){

        var start = $("#from_date").val();
        var end = $("#to_date").val();
        var shop = -1;
        var req = {
            op: "query",
            start: start,
            end: end,
            shop: shop
        }




        $.ajax({
            url: "total_report_request.php",
            method: "POST",
            dataType: "json",
            data: {request: req}
        })
        .done(function(msg) {
            console.log('query log success!11');
            //console.log(JSON.stringify(msg));
            console.log(msg);
            
            var pie_chart_data3 = getPieChartData(msg, 0);
            var pie_chart_data4 = getPieChartData(msg, 1);
            drawPieChart(pie_chart_data3, 2);
            drawPieChart(pie_chart_data4, 3);

            var bar_chart_data3 = getBarChartData(msg, 0);
            var bar_chart_data4 = getBarChartData(msg, 1);
            drawBarChart(bar_chart_data3, 2);
            drawBarChart(bar_chart_data4, 3);

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // need to change ajax return type into 'text' to see error msg
            console.log(textStatus, errorThrown);
            alert('cannot query report!!!');
        })
        .always(function() {

        });




    });



});



/* === Global variable === */
var threshold = 0.05    // for drawing pie chart hovering threshold
/* ===      End        === */

// Get all the Log data for a shop query
function queryLog(start, end) {
    var req = {
        op: "query",
        start: start,
        end: end,
      //  shop: shop
    }
    return req;
}





// Flot Pie Chart
function drawPieChart(data, index) {

    var options = {
        series: {
            pie: {
                show: true,
                radius: 1,
                innerRadius: 0.5,
                label: {
                    show: true,
                    radius: 3/4,
                    formatter: labelFormatter,
                    threshold: threshold
                }
            }
        },
        legend: {
            show: false
        },
        grid: {
            hoverable: true
        },
        tooltip: {
            show: true,
            content: makeTooltipContent,
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false,
            // onHover: func(flotItem, $tooltipEl) -> action
        }
    };

    function labelFormatter(label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:black;'>" + label + "<br/>" + Math.round(series.percent * 10)/10 + "%</div>";
    }

    function makeTooltipContent(label, xval, yval, flotItem) {
        if (flotItem.series.percent < threshold*100) {
            return "%p.1%, %s"; // show percentages, rounding to 1 decimal places
        }
        return false;
    }

    if(index == 0){
        var plotObj = $.plot($("#flot-pie-chart"), data, options);
    }else if(index == 1){
        var plotObj = $.plot($("#flot-pie-chart2"), data, options);

    }else if(index == 2){
        var plotObj = $.plot($("#flot-pie-chart3"), data, options);

    }else if(index == 3){
        var plotObj = $.plot($("#flot-pie-chart4"), data, options);

    }
}


function handleLog(log) {
    // console.log(JSON.stringify(log));
    var pie_chart_data1 = getPieChartData(log, 0);
    var pie_chart_data2 = getPieChartData(log, 1);
    drawPieChart(pie_chart_data1, 0);
    drawPieChart(pie_chart_data2, 1);
//    var line_chart_data = getLineChartData(log);
//    drawLineChart(line_chart_data);

    var bar_chart_data1 = getBarChartData(log, 0);
    var bar_chart_data2 = getBarChartData(log, 1);
    drawBarChart(bar_chart_data1, 0);
    drawBarChart(bar_chart_data2, 1);
}



function getData(request) {
    $.ajax({
        url: "total_report_request.php",
        method: "POST",
        dataType: "json",
        data: {request: request}
    })
    .done(function(msg) {
        console.log('query log success!11');
        //console.log(JSON.stringify(msg));
        console.log(msg);
        handleLog(msg);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // need to change ajax return type into 'text' to see error msg
        console.log(textStatus, errorThrown);
        alert('cannot query report!!!');
    })
    .always(function() {

    });
}


function getPieChartData(log, mode) {
// mode = 0 is price , mode = 1 is quantity
    data = [];
    if(mode == 0){
        for (var i = 0; i < log.length; i++) {
            var series = log[i].s_text;
            var total_price = log[i].price * log[i].quantity;

            var result = $.grep(data, function(e){ return e['label'] == series; });
            if (result.length == 0) {
                var obj = {label: series, data: total_price}
                data.push(obj);
            }
            else {
                // For the result.length is always 1, we can did result[0]
                result[0]['data'] = parseInt(result[0]['data']) + total_price;
            }
        }
    }else if(mode ==1){
        for (var i = 0; i < log.length; i++) {
            var series = log[i].s_text;
            var total_quantity = parseInt(log[i].quantity);

            var result = $.grep(data, function(e){ return e['label'] == series; });
            if (result.length == 0) {
                var obj = {label: series, data: total_quantity}
                data.push(obj);
            }
            else {
                // For the result.length is always 1, we can did result[0]
                result[0]['data'] = parseInt(result[0]['data']) + total_quantity;
            }
        }


    }


    return data;
}


function getBarChartData(log, mode){
    // if mode == 0 get total price report, else get total amount

    var data = [];
    var time_slot_data = [];
    time_slot_data[0] = -1 ;

    for (var i =0 ; i< 23 ; ++i){
        data[i] = [];
        time_slot_data[i] = 0 ;
    }

    if(mode == 0){
        for (var i = 0; i < log.length; i++) {
        
            var hour_slot = log[i].time.split(' ')[1].split(':')[0];
            time_slot_data[hour_slot -1] = time_slot_data[hour_slot -1] + log[i].price * log[i].quantity;
        }

    }else{
        for (var i = 0; i < log.length; i++) {
        
            var hour_slot = log[i].time.split(' ')[1].split(':')[0];
            time_slot_data[hour_slot -1] = parseInt(time_slot_data[hour_slot -1]) + parseInt(log[i].quantity);
        }

    }

    for (var i =0 ; i< 23 ; ++i){
        data[i][0] = i+1;
        data[i][1] = time_slot_data[i];
    }

    return data;
}

function drawBarChart(data, index) {

    var barOptions = {
        series: {
            bars: {
                show: true,
                barWidth: 1
            }
        },
        xaxis: {
            mode: "time",
            timeformat: "%h",

//	    tickFormatter: function (val, axis) {
//                return 1;
//            },
	        axisLabel: '時間(每小時)',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 18,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 12,
            ticks:[[1,'01'],[2,'02'],[3,'03'],[4,'04'],[5,'05'],[6,'06'],[7,'07'],[8,'08'],[9,'09'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15'],[16,'16'],[17,'17'],[18,'18'],[19,'19'],[20,'20'],[21,'21'],[22,'22'],[23,'23'],[24,'24']],

            minTickSize: [1, "hour"]
        },
        grid: {
            hoverable: true
        },
        legend: {
            show: false
        },
        yaxis:{
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 18,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 12,
            min:0,

        },
        tooltip: true,
        tooltipOpts: {
            content: "y: %y"
        }
    };

    
    if(index == 0){
        barOptions['yaxis']['axisLabel'] = '營收(元)';

    }else if(index == 1){
        barOptions['yaxis']['axisLabel'] = '杯數(杯)';

    }

    var barData = {
        label: "bar",
        data: data
    };
    if(index == 0){
        $.plot($("#flot-bar-chart"), [barData], barOptions);


    }
    else if(index==1){
        $.plot($("#flot-bar-chart2"), [barData], barOptions);

    }
    else if(index==2){
        $.plot($("#flot-bar-chart3"), [barData], barOptions);

    }
    else if(index==3){
        $.plot($("#flot-bar-chart4"), [barData], barOptions);

    }
}

