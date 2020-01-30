

var rednerGist = function (data, chartContainerId) {

    var chart = new CanvasJS.Chart(chartContainerId, {
        title: {
            text: ""
        },
        axisX: {
            interval: 1,
            lineThickness: 0,
            labelFontFamily: 'Open Sans',
            labelFontColor: '#333333',
            labelFontSize: '12'
        },
        axisY2: {
            valueFormatString: "0",
            lineThickness: 0,
            gridThickness: 1,
            tickThickness: 0,
            gridColor: '#DDDDDD',
            labelFontFamily: 'Open Sans',
            labelFontColor: '#a0a5ab',
            labelFontSize: '11'
        },
        toolTip: {
            shared: true,
            content: function (e) {

                var firstBar = "";
                var secondBar = "";
                var separator = "";
                try { firstBar = e.entries[0].dataSeries.name + ": <strong>" + e.entries[0].dataPoint.y + data.type + "</strong>"; } catch (ex) { }
                try { secondBar = e.entries[1].dataSeries.name + ": <strong>" + (e.entries[1].dataPoint.y + e.entries[0].dataPoint.y) + data.type + "</strong>"; } catch (ex) { }
                if (e.entries[0].dataPoint.y == 0)
                    firstBar = "";

                if (secondBar && firstBar)
                    separator = "<br/>";
                var content = secondBar + separator + firstBar;
                return content;
            }
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },

        data: [
            {
                type: "stackedBar",
                showInLegend: false,
                name: "Продажи через рекомендации",
                axisYType: "secondary",
                color: "#c4dafe",
                dataPoints: data.recom
            },
            {
                type: "stackedBar",
                showInLegend: false,
                name: "Продажи (всего)",
                axisYType: "secondary",
                color: "#30a1ec",
                dataPoints: OverlayBarsData(data.recom, data.all)
            },
            {
                type: "stackedBar",
                showInLegend: false,
                name: "Процент покупаемых товаров",
                axisYType: "secondary",
                color: "#c4dafe",
                dataPoints: data.ordered
            },
            {
                type: "stackedBar",
                showInLegend: false,
                name: "Процент просматриваемых товаров",
                axisYType: "secondary",
                color: "#30a1ec",
                dataPoints: OverlayBarsData(data.viewed, data.ordered)
            },
            {
                type: "bar",
                showInLegend: false,
                name: "Медиана времени принятия решения",
                axisYType: "secondary",
                color: "#30a1ec",
                dataPoints: data.decisiontime
            },
            {
                type: "bar",
                showInLegend: false,
                name: "Количество просмотренных товаров до заказа",
                axisYType: "secondary",
                color: "#30a1ec",
                dataPoints: data.vieweditems
            }
        ]
    });

    chart.render();
};

function OverlayBarsData(data1, data2) //метод для "наложения" данных на графиках, так как библиотека рассчитана на сложение данных
{
    var array = [];
    for (var point1 in data1) {
        for (var point2 in data2) {
            if (data1[point1].label == data2[point2].label) {
                array.push({ y: Math.abs(data2[point2].y - data1[point1].y), label: data1[point1].label });
                break;
            }
        }
    }
    return array;
}