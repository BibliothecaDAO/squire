"use strict";
import { SlashCommandBuilder } from "@discordjs/builders";
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Users = sequelize.define('users', {
	userId: {
		type: Sequelize.STRING,
		unique: true,
	},
    walletAddress: {
		type: Sequelize.STRING,
	},
});

Users.sync(); //this should be put in a client.once()

const setWalletAddres = async (userId: string, walletAddress: string) => {
    let statusMessage = '';
    const tag = await Users.findOne({ where: { userId: userId } });

    if (tag) {
        try {
            await Users.update({
                walletAddress: walletAddress,
            },{
                where: { userId: userId,}
            });
            statusMessage = 'INFO setWalletAddress:update';
        }
        catch (error) {
            statusMessage = 'ERROR setWalletAddress:update';
        }
    }
    else {
        try {
            // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
            await Users.create({
                userId: userId,
                walletAddress: walletAddress,
            });
            statusMessage = 'INFO setWalletAddress:create';
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
    
            }
            else {
                statusMessage = 'ERROR setWalletAddress:create';
            }
        }
    }

    return {
        attributes: {
            title: "setWalletAddressStatusMessage",
            fields: [
                {
                    name: "userId",
                    value: userId,
                },
                {
                    name: "walletAddress",
                    value: walletAddress,
                },
                {
                    name: "statusMessage",
                    value: statusMessage,
                },
            ],
            timestamp: new Date(),
        }
    };
};

export = {
    data: new SlashCommandBuilder()
        .setName("set_wallet_address")
        .setDescription("Set your Starknet wallet address (0x)")
        .addStringOption((option) =>
        option.setName("address").setDescription("Enter Starknet wallet address (0x)")
        ),
    async execute(interaction: any) {
        const walletAddres = interaction.options.getString("address");
        const userId = interaction.user.id;
        const res = await setWalletAddres(userId, walletAddres);
        await interaction.reply({
            embeds: [res.attributes],
            fetchReply: true,
          });
        },
};
