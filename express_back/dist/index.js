var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { createClient } from "redis";
const client = createClient();
const app = express();
app.use(express.json());
client.on("error", (err) => {
    console.log("redis client error : " + err);
});
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = req.body;
    try {
        const data = JSON.stringify({
            code,
            language,
            problemId
        });
        yield client.lPush("problems", data);
        res.status(200).send("Submission received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connect to Redish");
            app.listen(3000, "0.0.0.0", () => {
                console.log("Server Connected to : 3000 ");
            });
        }
        catch (err) {
            console.log("error in connecting to redis and server", err);
        }
    });
}
startServer();
