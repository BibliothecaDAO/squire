require('dotenv').config();
import { blobert, ConversationAgent } from '../agents';
import { Router } from 'express';
// import client from '../services/discord';

const Agent = Router();

Agent.post('/chat', async (req: any, res: any) => {

    const { question } = req.body;

    let response;

    const chat = new ConversationAgent(blobert);

    try {
        response = await chat.getResponse(question);
    } catch (e) {
        console.log(e)
    }

    res.send(JSON.stringify({ data: response }));
});

export default Agent
