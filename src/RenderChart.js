const fs = require("fs");
const {ChartJSNodeCanvas} = require("chartjs-node-canvas");

let FormatChartData = (data, type) => {
    let resultBuffer = {};
    let result = [];
    
    for (let i = 0; i < data.length; i++) {
        let parsedDate = new Date(data[i].x).toISOString().split(type[0])[0] + type;
        if (resultBuffer[parsedDate] == undefined) {
            resultBuffer[parsedDate] = [];
        }

        resultBuffer[parsedDate].push(data[i].y);    
    }

    for (let date in resultBuffer) {
        result.push({
            x: (new Date(date).getTime()).toString(),
            y: Math.max(...resultBuffer[date])//resultBuffer[date].reduce((a, b) => a + b) / resultBuffer[date].length
        });
    }

    return result;
}

module.exports = {
    RenderChart: (code, time, data) => {
        return new Promise(async resolve => {
            const fileName = `${code}${time}_${Date.now()}.png`;

            let formattedData;
            if (time > 7) {
                formattedData = FormatChartData(data, "T00:00:00.000Z");
            } else {
                formattedData = FormatChartData(data, ":00:00.000Z");
            }

            const chartJSNodeCanvas = new ChartJSNodeCanvas({
                width: 512,
                height: 512,
                backgroundColor: "white"
            });
            const config = {
                type: "line",
                data: {
                    datasets: [{
                        label: `Price over ${time} day(s)`,
                        borderColor: "#03fc5e",
                        backgroundColor: "#03fc5e",
                        borderWidth: 5,
                        data: formattedData
                    }]
                },
                options: {
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 24
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                boxWidth: 0,
                                font: {
                                    size: 24
                                }
                            }
                        }
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    layout: {
                        padding: 24
                    }
                },
                plugins: [{
                    beforeDraw: (chart) => {
                        let ctx = chart.ctx;
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, chart.width, chart.height);
                    }
                }, {
                    beforeInit: (chart) => {
                        chart.legend.afterFit = () => {
                            this.height = this.height + 50;
                        }
                    }
                }]
            };

            const image = await chartJSNodeCanvas.renderToBuffer(config);
            fs.writeFile(`./img/${fileName}`, image, "binary", (err) => {
                if (err) {
                    console.error(err);
                }

                resolve(fileName);
            });
        });
    }
};