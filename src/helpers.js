const {Collection} = require("discord.js");

module.exports = {
    CalculatePrice: (members, shares) => members + shares * 0.1,

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