require('dotenv').config();
import client from '../services/discord';
import { Router } from 'express';
import { BattleEvent, IndexerEvent } from '../types';


const IndexerRouter = Router();

const battleEvent = (e: BattleEvent) => {
    return {
        title: "Ser, Ye've been attacked!",
        description: "BattleEvent report",
        fields: [
            {
                name: "tx hash",
                value: e.txHash,
            },
            {
                name: "attacker",
                value: e.walletAddress,
            },
            {
                name: "stolen resources",
                value: "example resources",
            }
        ],
        timestamp: new Date(),
    }
}

IndexerRouter.post('/event', (req: IndexerEvent, res: any) => {
    client.channels.fetch('1004698995765035021')
        .then((channel: any) => {
            channel.send({
                embeds: [battleEvent(req.body)]
            });
        })
        .catch(console.error);

    res.send("Indexer: success");
});

export default IndexerRouter
