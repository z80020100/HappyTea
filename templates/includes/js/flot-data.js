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

    var req = queryLog(start, end);
    // console.log(JSON.stringify(req));


    getData(req);

//    $('#dataTable').DataTable({
//        responsive: true,
//        bInfo: false,
//    });









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
function drawPieChart(data) {

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

    var plotObj = $.plot($("#flot-pie-chart"), data, options);
}


function handleLog(log) {
    // console.log(JSON.stringify(log));
    var pie_chart_data = getPieChartData(log);
    drawPieChart(pie_chart_data);
//    var line_chart_data = getLineChartData(log);
//    drawLineChart(line_chart_data);
    var bar_chart_data = getBarChartData(log);
    drawBarChart(bar_chart_data);
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
        //console.log(msg[0]);
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


function getPieChartData(log) {

    data = [];
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
    return data;
}


function getBarChartData(log){


    var data = [];
    var time_slot_data = [];
    time_slot_data[0] = -1 ;
    for (var i =0 ; i< 23 ; ++i){
	data[i] = [];
	time_slot_data[i] = 0 ;
    }
    for (var i = 0; i < log.length; i++) {
	
	var hour_slot = log[i].time.split(' ')[1].split(':')[0];
	time_slot_data[hour_slot -1] = time_slot_data[hour_slot -1] + log[i].price * log[i].quantity;

    }
    for (var i =0 ; i< 23 ; ++i){
	data[i][0] = i+1;
	data[i][1] = time_slot_data[i];
    }


    return data;
}

function drawBarChart(data) {

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
	    axisLabel: 'Month',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 5,
            ticks:[[1,'01'],[2,'02'],[3,'03'],[4,'04'],[5,'05'],[6,'06'],[7,'07'],[8,'08'],[9,'09'],[10,'10'],[11,'11'],[12,'12'],[13,'13'],[14,'14'],[15,'15'],[16,'16'],[17,'17'],[18,'18'],[19,'19'],[20,'20'],[21,'21'],[22,'22'],[23,'23'],[24,'24']],

            minTickSize: [1, "hour"]
        },
        grid: {
            hoverable: true
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "y: %y"
        }
    };
    var barData = {
        label: "bar",
        data: data
    };
    $.plot($("#flot-bar-chart"), [barData], barOptions);
}

////Flot Bar Chart
//
//$(function() {
//
//    var barOptions = {
//        series: {
//            bars: {
//                show: true,
//                barWidth: 43200000
//            }
//        },
//        xaxis: {
//            mode: "time",
//            timeformat: "%m/%d",
//            minTickSize: [1, "day"]
//        },
//        grid: {
//            hoverable: true
//        },
//        legend: {
//            show: false
//        },
//        tooltip: true,
//        tooltipOpts: {
//            content: "x: %x, y: %y"
//        }
//    };
//    var barData = {
//        label: "bar",
//        data: [
//            [1354521600000, 1000],
//            [1355040000000, 2000],
//            [1355223600000, 3000],
//            [1355306400000, 4000],
//            [1355487300000, 5000],
//            [1355571900000, 6000]
//        ]
//    };
//    $.plot($("#flot-bar-chart"), [barData], barOptions);
//
//});
