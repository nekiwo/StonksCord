const {GetAllStocksData, GetAllStockMembersData, DeleteStockMembersData} = require("./db");

// I just don't know how to make a SQL query to clean the database, so here's a script 
GetAllStocksData().then(data => {
    data.forEach(stock => {
        let stockBuffer = {};
        let stockResult = {
            members: [],
            price: [],
            total_shares: [],
            time_stamps: []
        };

        stock.time_stamps.forEach(timestamp => {
            let parsedTimestamp = new Date(date).toISOString().split("T")[0] + "T00:00:00.000Z";
            if (stockBuffer[parsedTimestamp] == undefined) {
                stockBuffer[parsedTimestamp] = [];
            }

            stockBuffer[parsedTimestamp].push(timestamp);
        });

        for (let date in stockBuffer) {
            if (Date.now() - new Date(date).getTime() > 604800000) { // 7 days
                let max = Math.max(...stockBuffer[date]);
                let maxIndex = stock.time_stamps.indexOf(max);

                stockResult.members.push(stock.members[maxIndex]);
                stockResult.total_shares.push(stock.total_shares[maxIndex]);
                stockResult.price.push(stock.price[maxIndex]);
                stockResult.time_stamps.push(max);
            } else {
                stockBuffer[date].forEach(timestamp => {
                    let timestampIndex = stock.time_stamps.indexOf(timestamp);

                    stockResult.members.push(stock.members[timestampIndex]);
                    stockResult.total_shares.push(stock.total_shares[timestampIndex]);
                    stockResult.price.push(stock.price[timestampIndex]);
                    stockResult.time_stamps.push(timestamp);
                });
            }
        }

        // replace arrays in the stock
        DeleteStockMembersData(stock.id);
        

        // delete message timestamps older than 7 days in "stockCODE"

    });
});