import express from "express"
import { createClient } from "redis"

const client = createClient()
const app = express();

app.use(express.json())

client.on("error", (err) => {
    console.log("redis client error : " + err);
})

app.post("/submit", async (req, res) => {
    const { problemId, code, language } = req.body;

    try {
        const data = JSON.stringify({
            code,
            language,
            problemId
        })
        await client.lPush("problems", data)

        res.status(200).send("Submission received and stored.");
    } catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
})

async function startServer() {

    try {
        await client.connect();
        console.log("Connect to Redish");

        app.listen(3000, "0.0.0.0", () => {
            console.log("Server Connected to : 3000 ");
        })
    }
    catch (err) {
        console.log("error in connecting to redis and server", err);
    }
}

startServer()