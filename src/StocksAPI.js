const {GetStockData, UpdateStockData, CreateStockData, GetUserData, UpdateUserBalance, UpdateUserStock, DeleteUserStock, CreateUserData} = require("./db/db");
const {CalculatePrice} = require("./helpers");

module.exports = {
	GetStockInfo: (value, column) => {
        return new Promise(async resolve => {
            GetStockData(value, column).then(data => {
                if (data != undefined) {
                    let price = CalculatePrice(data.members.at(-1), data.total_shares.at(-1), data.market_cap.at(-1));
                    console.log(data)
                    console.log("market cap", data.market_cap.at(-1))
                    console.log("price", price)
                    if (price == NaN) {
                        price = 1;
                    }
                    resolve({
                        ID: data.id,
                        GuildID: data.guild_id,
                        Price: price,
                        MarketCap: Number(data.market_cap.at(-1)),
                        TotalShares: data.total_shares.at(-1),
                        Invite: data.invite
                    });
                } else {
                    resolve({});
                }
            });
        });
    },

    GetStockOverTime: () => {
        
    },

    GetStocksList: () => {
        
    },

    UpdateStockInfo: (code, members, shares, marketCap) => {
        UpdateStockData(code, members, shares, marketCap);
    },

    CreateStockInfo: (id, guild, channel) => {
        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            CreateStockData(
                id,
                guild.id,
                `https://discord.gg/${invite.code}`,
                guild.members.cache.filter(member => !member.user.bot).size
            );
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

    UpdateUserInfo: (id, balance, stock) => {
        const stockString = `${stock.id} ${stock.shares}`;
        UpdateUserBalance(id, balance);
        console.log("balance", balance)
        module.exports.GetUserInfo(id).then(userData => {
            let userStock = userData.Stocks.filter(s => s.id === stock.id);
            let userStockIndex = userData.Stocks.indexOf(userStock);
            
            if (!stock.delete) {
                if (userStock != []) {
                    UpdateUserStock(id, stockString, true, userStockIndex);
                } else {
                    UpdateUserStock(id, stockString, false);
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