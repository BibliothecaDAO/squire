import fs from 'node:fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9';
import { Client, Intents } from "discord.js";
import { discordConfig } from '../../config'

export const setupDiscordCommands = () => {

    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ],
    });

    // Clear existing guild commands
    const guild = client.guilds.cache.get(discordConfig.guild_id);
    guild?.commands.set([]);

    const commands = [];
    const commandFiles = fs.readdirSync('app/services/discord/commands').filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        let name = file.replace(".ts", ".js")
        const command = require(`./commands/${name}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(discordConfig.token);

    // Clear existing global commands - Fix for having duplicate commands when restarting the bot.
    // Note: Sometimes takes 1 hour to complete on the server ;(
    rest.get(Routes.applicationCommands(discordConfig.client_id))
    .then(data => {
        const promises = [];
        console.log(data); 
        if(data instanceof Array) {
            for (const command of data) {
                const deleteUrl = `${Routes.applicationCommands(discordConfig.client_id)}/${command.id}` as const;
                console.log(deleteUrl);
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        } else {
            return null;
        }
    });

    rest.put(Routes.applicationCommands(discordConfig.client_id), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}
