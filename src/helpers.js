

module.exports = {
	InviteToGuild: (invite) => {
        client.guilds.cache.forEach(guild => {
            guild.fetchInvites().then(inviteObjs => { 
                inviteObjs.forEach(inviteObj => {
                    if (inviteObj.code == invite) {
                        return guild;
                    }
                });
            });
        });

        return "";
    },

    GuildToStockCode: (code) => {
        
    },

    StockCodeToGuild: (code) => {
        
    }
};