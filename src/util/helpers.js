const {Collection} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    CalculatePrice: (members) => {
        return new Promise(async resolve => {
            let price = 1;

            members.forEach(memberMessages => {
                if (Number(memberMessages.cardinality) > 10) {
                    price++;
                }
            });
        
            resolve(price);
        });
    },

    RoundPlaces: (amount) => Math.round(amount * 100) / 100,

	InviteToGuild: (invite, client) => {
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

    FindGuild: (id, client) => {
        return client.guilds.cache.get(id);
    },

    TotalMembers: invite => {
        return new Promise(async resolve => {
            const parsedInvite = invite.replace("https://discord.gg/", "");
            fetch(`https://discord.com/api/v10/invites/${parsedInvite}?with_counts=true`)
                .then(res => res.json())
                .then(data => {
                    resolve(data.approximate_member_count);
                })
                .catch(e => console.error(e));
        });
    },

    ReviewStockInfo: (id, client, channel) => {
        channel.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            client.users.fetch("546463211675844653", false).then(user => {
                user.send(`REVIEW\ncode: ${id}\ninvite: https://discord.gg/${invite.code}`);
            });
        }).catch(console.error);
    }
};