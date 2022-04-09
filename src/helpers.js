const { Collection } = require("discord.js");
const {client} = require("./index");

module.exports = {
    // FIX guild.invites.fetch() QUICK
	InviteToGuild: (invite) => {
        client.guilds.cache.forEach(guild => {
            console.log(guild.constructor)
            console.log(guild.members.get(client.user.id).hasPermission("ADMINISTRATOR"));
            guild.invites.fetch().then(inviteObjs => { 
                inviteObjs.forEach(inviteObj => {
                    console.log(inviteObj);
                    if (inviteObj.code == invite) {
                        return guild;
                    }
                });
            });
        });

        return "";
    },

    StockCodeToGuild: (code) => {
        
    }
};