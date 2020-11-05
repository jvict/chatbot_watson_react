//import dependecies
const express = require("express");
const router = express.Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");


//2create instance of Assistant

//2.1 FIrst authenticate
const autheticator = new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY,
})

//2.2 connect to assistant
const assistant = new AssistantV2({
    version: "2019-02-28",
    authenticator: autheticator,
    url: process.env.ASSISTANT_URL,

})

// 3 . ROUte to handle session tokens
router.get("/session", async (req, res) => {
    try {
        const session = await assistant.createSession({
            assistantId: process.env.ASSISTANT_ID
        });
        //res.json(session["result"]);
    } catch (err) {
        res.send("There was an error processing your request");
        console.log("Erro: " + err);
    }
});

//4. Handle MEssages
router.post("/message", async (req, res) => {

    // console.log(req.body)
    //constructor payload
    var payload = {
        assistantId: process.env.ASSISTANT_ID,
        sessionId: req.headers.session_id,
        input: {
            message_type: 'text',
            text: '',
        },

    };

    try {
        const message = await assistant.message(payload);
        res.json(message["result"]);

    } catch (err) {
        res.send("There was an error processing your request aqui");
        console.log(err);
    }
});
//5. Exports ROutes
module.exports = router; 