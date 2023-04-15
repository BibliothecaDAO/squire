import { SlashCommandBuilder } from "@discordjs/builders";
// import { addPlayer } from "../../../prisma/index";

const addressCommand = {
    data: new SlashCommandBuilder()
        .setName("address")
        .setDescription("add address to your profile")
        .addStringOption((option) =>
            option.setName("address").setDescription("Enter your StarkNet Address")
        ),
    async execute(interaction: any) {
        const address = interaction.options.getString("address");

        console.log(interaction.user.id)

        // await addPlayer(address, interaction.user.id)


        await interaction.reply('Successfully added!');

    },
};

export default addressCommand;