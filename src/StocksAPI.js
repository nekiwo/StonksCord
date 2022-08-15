const path = require("path");
const {GetStockData, GetStockMembersData, UpdateStockData, UpdateStockMembersData, CreateStockData, CreateStockMembersData, GetUserData, UpdateUserBalance, UpdateUserStock, DeleteUserStock, CreateUserData, GetStockDataOverTime, GetTopStocksData, GetTopUsersData} = require(path.join(__dirname, "db", "db"));
const {CalculatePrice, TotalMembers} = require(path.join(__dirname, "helpers"));

module.exports = {
	GetStockInfo: (value, column) => {
        return new Promise(async resolve => {
            GetStockData(value, column).then(stockData => {
                if (stockData != undefined) {
                    let price = 1;
                    GetStockMembersData(stockData.id).then(async membersData => {
                        if (membersData != undefined) {
                            price = await CalculatePrice(membersData);
                        }

                        //module.exports.UpdateStockInfo(stockData.id, stockData.members, stockData.total_shares, price)

                        resolve({
                            ID: stockData.id,
                            GuildID: stockData.guild_id,
                            Price: price,
                            TotalShares: stockData.total_shares,
                            Invite: stockData.invite
                        });
                    });
                } else {
                    resolve({});
                }
            });
        });
    },

    GetStockOverTime: (code, days, column) => {
        return new Promise(async resolve => {
            GetStockDataOverTime(code, days, column).then(stockData => {
                if (stockData != undefined) {
                    resolve(stockData);
                } else {
                    resolve({});
                }
            });
        });
    },

    GetTopStocksList: (isDesc) => {
        return new Promise(async resolve => {
            let desc = "DESC";
            if (isDesc) {
                desc = "";
            }

            GetTopStocksData(desc).then(stocksList => {
                if (stocksList != undefined) {
                    let result = [];
                    stocksList.forEach(stock => {
                        result.push({
                            Code: stock.id,
                            Change: (stock.current_price - stock.old_price).toString()
                        });
                    });

                    resolve(result);
                } else {
                    resolve([]);
                }
            });
        });
    },

    UpdateStockInfo: (code, members, shares, price) => {
        UpdateStockData(code, members, shares, price);
    },

    UpdateStockMembers: (code, userId) => {
        UpdateStockMembersData(code, userId);
    },

    CreateStockInfo: (id, guild, channel) => {
        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(async invite => {
            CreateStockData(
                id,
                guild.id,
                `https://discord.gg/${invite.code}`,
                await TotalMembers(invite.code)
            );

            CreateStockMembersData(id);
        }).catch(console.error);
    },

    GetUserInfo: (id) => {
        return new Promise(async resolve => {
            const data = await GetUserData(id);

            if (data != undefined) {
                let stocks = [];
                let worth = 0;

                for (const rawStockData of data.stocks) {
                    let stockId = rawStockData.split(" ")[0];
                    let shares = Number(rawStockData.split(" ")[1]);
                    let stockInfo = await module.exports.GetStockInfo(stockId, "id");
                    
                    if (stockInfo != {}) {
                        let stockWorth = shares * stockInfo.Price;
                        worth += stockWorth;
                        stocks.push({
                            id: stockId,
                            shares: shares,
                            price: stockInfo.Price,
                            worth: stockWorth
                        });
                    }
                }

                resolve({
                    ID: data.id,
                    Balance: Number(data.balance),
                    Worth: worth + Number(data.balance),
                    Stocks: stocks,
                });
            } else {
                resolve(0);
            }
        });
    },

    GetTopUsersList: (client) => {
        return new Promise(async resolve => {
            GetTopUsersData().then(async usersList => {
                console.log(usersList.length)
                if (usersList != undefined) {
                    let result = [];

                    for (let i = 0; i < usersList.length; i++) {
                        let user = usersList[i];
                        let fetchedUser = await client.users.fetch(user.id);

                        if (fetchedUser != undefined) {
                            result.push({
                                Tag: fetchedUser.username,
                                Worth: user.worth
                            });
                        }
                    }

                    resolve(result);
                } else {
                    resolve([]);
                }
            });
        });
    },

    UpdateUserInfo: (id, balance, stock, worth) => {
        const stockString = `${stock.id} ${stock.shares}`;
        UpdateUserBalance(id, balance, worth);
        module.exports.GetUserInfo(id).then(userData => {
            let userStock = userData.Stocks.filter(s => s.id === stock.id);
            let userStockIndex = userData.Stocks.indexOf(userStock[0]);

            if (!stock.delete) {
                if (userStockIndex > -1) {
                    UpdateUserStock(id, stockString, true, userStockIndex);
                } else {
                    UpdateUserStock(id, stockString, false, userStockIndex);
                }
            } else {
                DeleteUserStock(id, userStockIndex);
            }
        });
    },

    CreateUserInfo: (id) => {
        CreateUserData(id);
    }
};