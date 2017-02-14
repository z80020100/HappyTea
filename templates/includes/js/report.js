$(document).ready(function() {
    var start = '2016-01-01 00:00:00';
    var end = '2018-01-01 23:59:59';
    var shop = 1;

    var req = queryLog(start, end, shop);
    console.log(JSON.stringify(req));

    $.ajax({
        url: "report_process.php",
        method: "POST",
        dataType: "json",
        data: {request: req}
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

function labelFormatter(label, series) {
    return "<div style='font-size:8pt; text-align:center; padding:2px; color:black;'>" + label + "<br/>" + Math.round(series.percent * 10)/10 + "%</div>";
}

function makeTooltipContent(label, xval, yval, flotItem) {
    if (flotItem.series.percent < threshold*100) {
        return "%p.1%, %s"; // show percentages, rounding to 1 decimal places
    }
    return false;
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

    var plotObj = $.plot($("#flot-pie-chart"), data, options);
}

// Flot Line Chart
function drawLineChart() {

    var offset = 0;
    plot();

    function plot() {
        var sin = [],
            cos = [];
        for (var i = 0; i < 12; i += 0.2) {
            sin.push([i, Math.sin(i + offset)]);
            cos.push([i, Math.cos(i + offset)]);
        }

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                hoverable: true //IMPORTANT! this is needed for tooltip to work
            },
            yaxis: {
                min: -1.2,
                max: 1.2
            },
            tooltip: true,
            tooltipOpts: {
                content: "'%s' of %x.1 is %y.4",
                shifts: {
                    x: -60,
                    y: 25
                }
            }
        };

        var plotObj = $.plot($("#flot-line-chart"), [{
                data: sin,
                label: "sin(x)"
            }, {
                data: cos,
                label: "cos(x)"
            }],
            options);
    }
}