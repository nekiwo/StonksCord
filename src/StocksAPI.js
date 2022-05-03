const {GetStockData, UpdateStockData, CreateStockData, GetUserData, UpdateUserBalance, UpdateUserStock, DeleteUserStock, CreateUserData} = require("./db/db");
const {CalculatePrice} = require("./helpers");

module.exports = {
	GetStockInfo: (value, column) => {
        return new Promise(async resolve => {
            GetStockData(value, column).then(data => {
                if (data != undefined) {
                    let price = CalculatePrice(data.members.at(-1), data.total_shares.at(-1));
                    resolve({
                        ID: data.id,
                        GuildID: data.guild_id,
                        Price: price,
                        MarketCap: (data.total_shares.at(-1) * price), // Probably unefficient with larger arrays (5k+ items)
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

    UpdateStockInfo: (code, members, shares) => {
        UpdateStockData(code, members, shares);
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
                    Balance: data.balance,
                    Worth: Math.round(worth) + data.balance,
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
        module.exports.GetUserInfo(id).then(userData => {
            let userStock = userData.Stocks.filter(s => s.id === stock.id);
            
            if (!stock.delete) {
                if (userStock != []) {
                    UpdateUserStock(id, stockString, true, userData.Stocks.indexOf(userStock));
                } else {
                    UpdateUserStock(id, stockString, false);
                }
            } else {
                DeleteUserStock(id, userData.Stocks.indexOf(userStock));
            }
        });
    },

    CreateUserInfo: (id) => {
        CreateUserData(id);
    }
};