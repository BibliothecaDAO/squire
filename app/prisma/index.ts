import { prisma } from "../server";


// Helper function to retrieve the user ID based on an Ethereum address
export async function getPlayerIdByStarkAddress(address: string): Promise<number | undefined> {
    try {
        const player = await prisma.player.findFirst({
            where: {
                stark_address: address
            },
            select: {
                id: true
            }
        });

        return player?.id;
    } catch (error) {
        console.error("Error fetching player ID by Stark address:", error);
        throw error;
    }
}

export async function addPlayer(starkAddress: string, discordId: string): Promise<any> {
    try {
        const newPlayer = await prisma.player.create({
            data: {
                stark_address: starkAddress,
                discord_id: discordId
            },
        });

        return newPlayer;
    } catch (error) {
        console.error("Error adding player with Stark and Ethereum addresses:", error);
        throw error;
    }
}