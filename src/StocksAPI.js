const {GetStockData, GetStockMembersData, UpdateStockData, UpdateStockMembersData, CreateStockData, CreateStockMembersData, GetUserData, UpdateUserBalance, UpdateUserStock, DeleteUserStock, CreateUserData} = require("./db/db");
const {CalculatePrice, TotalMembers} = require("./helpers");

module.exports = {
	GetStockInfo: (value, column) => {
        return new Promise(async resolve => {
            GetStockData(value, column).then(stockData => {
                if (stockData != undefined) {
                    let price = 1;
                    GetStockMembersData(stockData.id).then(membersData => {
                        console.log("membersData", membersData)
                        if (membersData != undefined) {
                            price = CalculatePrice(membersData);
                        }

                        module.exports.UpdateStockInfo(stockData.id, stockData.members.at(-1), stockData.total_shares.at(-1), price)

                        resolve({
                            ID: stockData.id,
                            GuildID: stockData.guild_id,
                            Price: price,
                            TotalShares: stockData.total_shares.at(-1),
                            Invite: stockData.invite
                        });
                    });
                } else {
                    resolve({});
                }
            });
        });
    },

    GetStockOverTime: (days, column) => {
        
    },

    GetStocksList: () => {
        
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

    UpdateUserInfo: (id, balance, stock) => {
        const stockString = `${stock.id} ${stock.shares}`;
        UpdateUserBalance(id, balance);
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