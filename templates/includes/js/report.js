//Flot Pie Chart
function drawPieChart() {

    var data = [{
        label: "Series 0",
        data: 1
    }, {
        label: "Series 1",
        data: 3
    }, {
        label: "Series 2",
        data: 9
    }, {
        label: "Series 3",
        data: 20
    }];

    var plotObj = $.plot($("#flot-pie-chart"), data, {
        series: {
            pie: {
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    });
}

//Flot Line Chart
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
        console.log(JSON.stringify(msg));
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // need to change ajax return type into 'text' to see error msg
        console.log(textStatus, errorThrown);
        alert('cannot query report!');
    })
    .always(function() {

    });


});
