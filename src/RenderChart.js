const fs = require("fs");
const path = require("path");
const {ChartJSNodeCanvas} = require("chartjs-node-canvas");

const formatChartData = (data) => {
    let result = {
        x: [],
        y: []
    };

    const timeMin = new Date(data[0].x).getTime();
    const timeMax = new Date(data.at(-1).x).getTime() - timeMin;
 
    data.forEach(point => {
        result.x.push(((new Date(point.x).getTime() - timeMin) / timeMax) * 10);
        result.y.push(point.y);
    });

    return result;
}

module.exports = {
    RenderChart: (code, time, data) => {
        return new Promise(async resolve => {
            const fileName = `${code}${time}_${Date.now()}.png`;

            const formattedData = formatChartData(data);
            const formattedTime = Math.ceil((Date.now() - (new Date(data[0].x).getTime() - 1000 * 60 * 60 * 5)) / 86400000) // = 1000 * 60 * 60

            const chartJSNodeCanvas = new ChartJSNodeCanvas({
                width: 512,
                height: 512,
                backgroundColor: "white"
            });

            const image = await chartJSNodeCanvas.renderToBuffer({
                type: "line",
                data: {
                    labels: formattedData.x,
                    datasets: [{
                        label: `Price over past ${formattedTime} day(s)`,
                        borderColor: "#03fc5e",
                        backgroundColor: "#03fc5e",
                        borderWidth: 5,
                        data: formattedData.y
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
                        point: {
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
            });

            fs.writeFile(path.join(__dirname, "img", fileName), image, "binary", (err) => {
                if (err) {
                    console.error(err);
                }

                resolve(fileName);
            });
        });
    }
};