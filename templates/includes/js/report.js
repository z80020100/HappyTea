$(document).ready(function() {

    var start = '2016-01-01 00:00:00';
    var end = '2018-01-01 23:59:59';
    var shop = 1;

    var req = queryLog(start, end, shop);
    // console.log(JSON.stringify(req));

    ajax(req);

    $('#dataTable').DataTable({
        responsive: true,
        bInfo: false,
    });

});


/* === Global variable === */
var threshold = 0.05    // for drawing pie chart hovering threshold
/* ===      End        === */

// Get all the Log data for a shop query
function queryLog(start, end, shop) {
    var req = {
        op: "query",
        start: start,
        end: end,
        shop: shop
    }
    return req;
}

function handleLog(log) {
    // console.log(JSON.stringify(log));
    var pie_chart_data = getPieChartData(log);
    drawPieChart(pie_chart_data);
    var line_chart_data = getLineChartData(log);
    drawLineChart(line_chart_data);
}

function ajax(request) {
    $.ajax({
        url: "report_process.php",
        method: "POST",
        dataType: "json",
        data: {request: request}
    })
    .done(function(msg) {
        console.log('query log success!');
        // console.log(JSON.stringify(msg));
        handleLog(msg);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // need to change ajax return type into 'text' to see error msg
        console.log(textStatus, errorThrown);
        alert('cannot query report!');
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

function getLineChartData(log) {

    data = [];
    for (var i = 0; i < log.length; i++) {
        var time = log[i].time.split(' ')[0];
        var total_price = log[i].price * log[i].quantity;

        var result = $.grep(data, function(e){ return e[0] == time; });
        if (result.length == 0) {
            var obj = [time, total_price];
            data.push(obj);
        }
        else {
            // For the result.length is always 1, we can did result[0]
            result[0][1] = parseInt(result[0][1]) + total_price;
        }
    }

    data.sort();
    // console.log(data);

    for (var i = 0; i < data.length; i++) {
        var year = data[i][0].split('-')[0];
        var month = data[i][0].split('-')[1];
        var day = data[i][0].split('-')[2];
        data[i][0] = DateGetTime(year, month, day);
    }

    return data;
}

function DateGetTime(year, month, day) {
    // .getTime() will return the millisec since 1970/01/01
    // BUT!!! the month parameter should -1 and then can give as argument
    // e.g. Jan -> 00, Feb -> 01 and so on
    // http://stackoverflow.com/questions/19738795/calculate-date-time-from-date-gettime
    return new Date(year, month-1, day).getTime();
}

function TimeSetDate(digit) {
    return new Date(digit);
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

// Flot Line Chart
function drawLineChart(data) {

    /* Reference:
    http://www.pikemere.co.uk/blog/flot-how-to-create-line-graphs
    *****/

    var dataset = [
        { label: "Sales Price", data: data}
    ];

    var options = {
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        legend: {
            show: false
        },
        grid: {
            hoverable: true //IMPORTANT! this is needed for tooltip to work
        },
        xaxis: {
            mode: "time",
            tickSize: [1, "month"],
            tickLength: 0,
            axisLabel: "Month",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, sans-serif',
            axisLabelPadding: 3
        },
        yaxis: {
            axisLabel: "Sales Price",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, sans-serif',
            axisLabelPadding: 3,
        },
        tooltip: {
            show: true,
            content: makeTooltipContent,
            shifts: {
                x: -60,
                y: -30
            }
        }
    };

    function makeTooltipContent(label, xval, yval, flotItem) {
        var Mon2Num = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'Jun': 6,
            'Jul': 7,
            'Aug': 8,
            'Sep': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12
        }
        var d_m_d_y = TimeSetDate(flotItem.datapoint[0]).toString().split(' ').slice(0, 4);
        var datestring = d_m_d_y[3] + '/' + Mon2Num[d_m_d_y[1]] + '/' + d_m_d_y[2];
        return datestring + ': $' + flotItem.datapoint[1];
    }

    var plotObj = $.plot($("#flot-line-chart"), dataset, options);
}