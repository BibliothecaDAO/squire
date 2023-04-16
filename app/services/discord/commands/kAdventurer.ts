import { SlashCommandBuilder } from "@discordjs/builders";
// import { adventurerTraits } from "../../../services/utils/adventurer";
// import { createImage } from '../../utils/helpers';
import Replicate from "replicate";



interface IAdventurer {
    sex?: string;
    race?: string;
    skin?: string;
    hair?: string;
    eyes?: string;
    occupation?: string;
    pattern?: string;

}


const createPrompt = (props: IAdventurer) => {
    const { sex, race, occupation } = props;

    const one = 'a ';

    return one + sex + ' ' + race + ' ' + occupation
};



const adventurerCommand = {
    data: new SlashCommandBuilder()
        .setName("kadventurer")
        .setDescription("Build an Adventurer")
        .addStringOption(option =>
            option.setName('sex')
                .setDescription('Select Sex')
                .setRequired(true)
                .addChoices(
                    { name: 'male', value: 'male' },
                    { name: 'female', value: 'female' },
                    { name: 'n/a', value: 'non-binary' },)
        ).addStringOption(option =>
            option.setName('occupation')
                .setDescription('Select Sex')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'mage',
                        value: 'mage in silk clothing',
                    },
                    {
                        name: 'warrior',
                        value: 'warrior with detailed iron armour',
                    },
                    {
                        name: 'noble',
                        value: 'royal with a golden crown',
                    },
                    {
                        name: 'hunter',
                        value: 'deadly assassin with a linen hooded cloak with forehead jewelry and headband',
                    },
                )
        ).addStringOption(option =>
            option.setName('race')
                .setDescription('Select Race')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Hippo',
                        value:
                            'strong muscular hippo',

                    },
                    {
                        name: 'Elephant',
                        value:
                            'old war elephant',

                    },
                    {
                        name: 'Rhino',
                        value:
                            'strong powerful rhino with a spear and a shield and a crown',

                    },
                    {
                        name: 'Orangutan',
                        value:
                            'wise orangutan',

                    },
                    {
                        name: 'Chimpanzee',
                        value:
                            'snarling chimpanzee with a spear and a shield',

                    },
                    {
                        name: 'Elf',
                        value:
                            'mysterious perfectly looking elf with a smirk and pointy ears and gold necklace',

                    },
                    {
                        name: 'Fox',
                        value: 'cute red fox person in a red dress with a bow',

                    },
                    {
                        name: 'Giant',
                        value: 'giant with huge lips and ears and thinning hair',

                    },
                    {
                        name: 'Human',
                        value: 'Beautiful human with a smile',

                    },
                    {
                        name: 'Orc',
                        value: 'ugly hideous green orc',

                    },
                    {
                        name: 'Demon',
                        value: 'terrifying demon with sharp teeth',

                    },
                    {
                        name: 'Goblin',
                        value: 'disgusting goblin',

                    },
                    { name: 'Cat', value: 'cute cat humanoid ' },
                    {
                        name: 'Frog',
                        value: 'pepe the frog',

                    },
                )
        ).addStringOption(option =>
            option.setName('patterns')
                .setDescription('Select Patterns')
                .setRequired(true)
                .addChoices(
                    { name: 'Arabic', value: 'arabic face patterns' },
                    {
                        name: 'Chinese',
                        value: 'oriental chinese face patterns',

                    },
                    {
                        name: 'Australian',
                        value: 'australian aboriginal face patterns',

                    },
                    {
                        name: 'Egyptian',
                        value: 'Egyptian face patterns',

                    },
                    { name: 'Mayan', value: 'Mayan face patterns' },
                    { name: 'Aztec', value: 'Aztec face patterns' },
                )
        ),

    async execute(interaction: any) {
        const sex = interaction.options.getString("sex");
        const race = interaction.options.getString("race");
        const pattern = interaction.options.getString("patterns");
        const occupation = interaction.options.getString("occupation");

        const prompt = {
            prompt: `${createPrompt({ sex, race, pattern, occupation })}. Realist painting, Detailed, realistic, high quality, perfect, beautiful, saturated, perfect hands`,
            "negative_prompt": "cartoon, imperfect, poor quality, saturated, unrealistic",
            num_inference_steps: 100
        }


        console.log(prompt)

        await interaction.deferReply();

        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        const output = await replicate.run(
            "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
            {
                input: prompt
            }
        );

        console.log(output)

        try {
            await interaction.editReply({
                embeds: [{
                    title: 'Adventurer',
                    description: prompt.prompt,
                    image: {
                        url: output[0]
                    }
                }]
            });
        } catch (e) {
            console.log(e);
        }

    },
};

export default adventurerCommand;