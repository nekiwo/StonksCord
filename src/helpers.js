const {Collection} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    CalculatePrice: (members) => {
        let price = 1;

        members.forEach(members => {
            if (members.messages_pastday > 10) {
                price++;
            }
        });
        
        return price;
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
            console.log(parsedInvite)
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
                user.send(`REVIEW\ncode: ${id}\ninvite: ${invite}`);
            });
        }).catch(console.error);
    },

    RenderChart: (code, days) => {
        // check if image already exists
        // render one if not

        /* 
         * naming scheme: test7d1649812800000t.png
         *  - stock: test
         *  - timeframe: 7 days
         *  - time of render: 1649812800000 [unix epoch to the 10 minute precision]
         * 
         * calculate 10 minute precision:
         * - var epoch = unix epoch time in milliseconds 
         * - epoch - epoch % 600000
         * 
         */
    }
};