require('dotenv').config();
import { PineconeClient } from '@pinecone-database/pinecone';
import express from 'express';
import { blobert, ConversationAgent, visir } from './agents';
import ApiRouter from './router'
import { client as DiscordClient } from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';
import { PrismaClient } from '@prisma/client'

// import { Database } from 'sqlite3';
// import { createUsersTable } from './sqlite';
// import { Client as PostgresClient } from 'pg';

const app = express();
const port = 3000;

// Discord
DiscordClient
setupDiscordCommands()

export const prisma = new PrismaClient()

// Pincone
export const pinecone = new PineconeClient();
async function main(): Promise<void> {
    await pinecone.init({
        environment: "us-central1-gcp",
        apiKey: process.env.PINECONE_KEY || "",
    });
}

main();

export const visir_chat = new ConversationAgent(visir);
export const blobert_chat = new ConversationAgent(blobert);

app.use(express.json());

app.use("/", ApiRouter)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});