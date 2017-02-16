$(document).ready(function() {


    var start = '2016-01-01 00:00:00';
    var end = '2018-01-01 23:59:59';
    //var shop = 1;
    //var start = curr_year+'-'+curr_month+'-'+curr_date+' '+'00:00:00';
    //var end = curr_year+'-'+curr_month+'-'+(curr_date+1)+' '+'00:00:00';

    var req = queryLog(start, end);
    // console.log(JSON.stringify(req));

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

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
    alert(data[0]);

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
}



function getData(request) {
    $.ajax({
        url: "total_report_request.php",
        method: "POST",
        dataType: "text",
        data: {request: request}
    })
    .done(function(msg) {
        console.log('query log success!');
        //alert(msg[0]['log_id']);
        console.log(JSON.stringify(msg));
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
        alert(series);

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



//Flot Pie Chart
//$(function() {
//
//    var data = [{
//        label: "Series 0",
//        data: 1
//    }, {
//        label: "Series 1",
//        data: 3
//    }, {
//        label: "Series 2",
//        data: 9
//    }, {
//        label: "Series 3",
//        data: 20
//    }];
//
//    var plotObj = $.plot($("#flot-pie-chart"), data, {
//        series: {
//            pie: {
//                show: true
//            }
//        },
//        grid: {
//            hoverable: true
//        },
//        tooltip: true,
//        tooltipOpts: {
//            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
//            shifts: {
//                x: 20,
//                y: 0
//            },
//            defaultTheme: false
//        }
//    });
//
//});
//
//

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
