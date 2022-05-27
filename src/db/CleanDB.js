const {GetAllStocksData, GetAllStockMembersData} = require("./db");

GetAllStocksData().then(data => {
    data.forEach(stock => {
        let stockBuffer = {};
        let stockResult = {};

        stock.time_stamps.forEach(timestamp => {
            let parsedTimestamp = new Date(date).toISOString().split("T")[0] + "T00:00:00.000Z";
            if (stockBuffer[parsedTimestamp] == undefined) {
                stockBuffer[parsedTimestamp] = [];
            }

            stockBuffer[parsedTimestamp].push(timestamp);
        });

        for (let date in stockBuffer) {
            if (new Date(date).getTime() > "7 DAYS") {
                // get max, push to array
            } else {
                // add arrays
            }
        }
    });
});