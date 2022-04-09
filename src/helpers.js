const { Collection } = require("discord.js");
const {client} = require("./index");

module.exports = {
	InviteToGuild: (invite) => {
        client.guilds.cache.forEach(guild => {
            guild.invites.fetch().then(inviteObjs => { 
                inviteObjs.forEach(inviteObj => {
                    if (inviteObj.code == invite) {
                        console.log("success finding code")
                        return guild;
                    }
                });
            });
        });

        return {};
    },

    FindGuild: (id) => {
        return client.guilds.cache.get(id);
    }
};