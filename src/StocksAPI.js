const {GetStockData, UpdateStockData, CreateStockData, GetUserData, CreateUserData} = require("./db/db");
const {CalculatePrice} = require("./helpers");

module.exports = {
	GetStockInfo: async (code, isInvite) => {
        return new Promise(resolve => {
            GetStockData(code, isInvite).then(data => {
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
        GetStockData(code, false).then(data => {
            // Check if 10 minutes have passed since last info update
            if (Date.now() - 600000 > new Date(data.time_stamps.at(-1)).valueOf()) {
                UpdateStockData(code, members, shares);
            }
        });
    },

    CreateStockInfo: (id, guild, channel) => {
        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            CreateStockData(
                id,
                guild.id,
                invite.code,
                Number(guild.members.cache.filter(member => !member.user.bot).size)
            );
            console.log(
                invite.code,
                Number(guild.members.cache.filter(member => !member.user.bot).size)
            )
        }).catch(console.error);
    },

    GetUserInfo: async (id) => {
        return new Promise(resolve => {
            GetUserData(id).then(data => {
                if (data != undefined) {
                    let stocks = [];
                    let worth = 0;
                    data.stocks.forEach(async rawStockData => {
                        let stock = rawStockData.split(" ")[0];
                        let shares = Number(rawStockData.split(" ")[1]);
                        let stockInfo = await GetStockInfo(stock, false);
                        
                        if (stockInfo !== {}) {
                            let stockWorth = shares * stockInfo.Price;
                            worth += stockWorth;
                            stocks.push({
                                id: stock,
                                shares: shares,
                                price: stockInfo.Price,
                                worth: stockWorth
                            })
                        }
                    });

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
        });
    },

    UpdateUserInfo: () => {

    },

    CreateUserInfo: (id) => {
        console.log("create ", id)
        CreateUserData(id);
    }
};