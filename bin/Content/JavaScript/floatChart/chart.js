function GetSeriesOptions(ticks) {
    return {
        series: {
            lines: {
                show: true,
                lineWidth: 1,
                fill: true,
                fillColor: { colors: [{ opacity: 0.1 }, { opacity: 0.13 }] } // rgb(48,160,235)
            },
            points: {
                show: true,
                lineWidth: 2,
                radius: 3
            },
            shadowSize: 0,
            stack: true
        },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#f9f9f9",
            borderWidth: 0
        },
        legend: {
            show: false,
            labelBoxBorderColor: "#fff"
        },
        colors: ["#30a0eb", "#a7b5c5"],
        xaxis: {
            ticks: ticks,
            font: {
                size: 12,
                family: "Open Sans, Arial",
                variant: "small-caps",
                color: "#697695"
            }
        },
        yaxis: {
            ticks: 3,
            labelWidth: 50,
            tickDecimals: 0,
            font: {
                size: 12,
                color: "#9da3a9"
            }
        }
    };
}

function redraw(plot, data, message) {
    plot.setData([{ data: data, label: message }]);
    plot.setupGrid();
    plot.draw();
}

function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 30,
        left: x - 50,
        color: "#fff",
        padding: '2px 5px',
        'border-radius': '6px',
        'background-color': '#000',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

var previousPoint = null;
$("#statsChart").bind("plothover", function (event, pos, item) {
    if (item) {
        if (previousPoint != item.dataIndex) {
            previousPoint = item.dataIndex;

            $("#tooltip").remove();
            var val = item.datapoint[1];

            var month = item.series.xaxis.ticks[item.dataIndex].label;

            showTooltip(item.pageX, item.pageY, month + ": " + val);
        }
    } else {
        $("#tooltip").remove();
        previousPoint = null;
    }
});