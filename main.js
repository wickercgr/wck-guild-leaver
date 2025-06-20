const { Client } = require('discord.js-selfbot-v13');
const chalk = require("chalk");
const fs = require("fs");
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("db");
require("moment-duration-format");

const tokenler = fs.readFileSync('tokens.txt', 'utf-8').split('\r\n').filter(Boolean);

let control = 1;


setTimeout(async function () {
    if (control === 1) {
        console.log("");
        console.log("");
        console.log("");
        console.log(chalk.green("[INFO] ") + chalk.rgb(230, 184, 0)("LOADED TOKENS ") + chalk.rgb(255, 255, 255)("[ " + tokenler.length + " ]"));

        async function loginTokens() {
            for (let i = 0; i < tokenler.length; i++) {
                const client = new Client({
                    checkUpdate: false,
                });

                client.on('ready', async () => {
                    console.log("");
                    console.log(chalk.green("[INFO] ") + chalk.rgb(230, 184, 0)("NAME: ") + chalk.rgb(255, 255, 255)(`${client.user.tag}`));
                    console.log(chalk.green("[INFO] ") + chalk.rgb(230, 184, 0)("ID: ") + chalk.rgb(255, 255, 255)(`${client.user.id}`));
                    console.log(chalk.green("[INFO] ") + chalk.rgb(230, 184, 0)("SWITCH: ") + chalk.rgb(255, 255, 255)(i));
                    console.log(chalk.green("[INFO] ") + chalk.rgb(230, 184, 0)("GUILD COUNT: ") + chalk.rgb(255, 255, 255)(`${client.guilds.cache.size}`));

                    if (db.get("type") === "single") {
                        const guildID = db.get("guildid"); 
                        const guild = client.guilds.cache.get(guildID);
                        if (guild) {
                            guild.leave()
                                .then(() => console.log(chalk.green("[AI] ") + chalk.rgb(230, 184, 0)("Leaving From Server ") + chalk.rgb(46, 184, 46)(`[.] ${guild.name}`)))
                                .catch(console.error);
                        } else {
                            console.log(chalk.rgb(51, 119, 255)("   [AI] ") + chalk.rgb(204, 51, 153)("Server Not Found ") + chalk.rgb(46, 184, 46)(`[.] ${guildID}`));
                        }
                    } else if (db.get("type") === "all") {
                        const delay = 1000; 
                        const guilds = Array.from(client.guilds.cache.values());

                        async function leaveGuilds() {
                            for (let j = 0; j < guilds.length; j++) {
                                const guild = guilds[j];

                                try {
                                    await guild.leave();
                                    console.log(chalk.green("[AI] ") + chalk.rgb(230, 184, 0)("Leaving Server Process: ") + chalk.rgb(255, 255, 255)(`[.] ${guild.name}`));
                                } catch (error) {
                                    console.log(chalk.green("[AI] ") + chalk.rgb(230, 184, 0)("Leaving Server Process Error: ") + chalk.rgb(255, 255, 255)(`[.] ${guild.name}`));
                                }

                                await new Promise((resolve) => setTimeout(resolve, delay));
                            }

                            console.log(chalk.green("[AI] ") + chalk.rgb(230, 184, 0)("Leaving Server Process Successfully"));
                        }

                        leaveGuilds();
                    }
                });

                try {
                    await new Promise(resolve => setTimeout(resolve, 500)); 
                    await client.login(tokenler[i]);
                } catch (err) {
                    console.log(chalk.red("[SCRIPT ERROR] ") + chalk.rgb(230, 184, 0)("WCK SCRIPT, DETECTED ERROR! RETRYING [.] ") + chalk.green("[SUCCESS] "));
                }
            }
        }

        loginTokens();
    }
}, 2000);

process.on('unhandledRejection', err => {
    console.log(err);
});
