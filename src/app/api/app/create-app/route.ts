import { prisma } from "@/lib/db/prisma";
import { callGemini } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log("Received request to create app");
        const { name, config_json, userId } = await req.json();
        const app = await prisma.app.create({ //create a new app entry in the database for this user
            data: {
                name,
                config_json,
                userId,
            },
        })
        const chat = await prisma.chats.create({ //create a new chat entry for this app, so that we have a place to store the chat history for this app
            data: {
                appId: app.id,
                userId: userId,
                role: "user",
                messages: config_json, //config_json is the first message in the chat, which contains the system prompt and initial messages for the bot. This way, when we fetch the chat history for this app, we will have the full context of the conversation from the start.

            },
        });

        const aiResponse = await callGemini(config_json); //call Gemini with the config_json as the input, which will generate the initial response from the bot based on the system prompt and initial messages provided in the config_json
        const botChat = await prisma.chats.create({
            data: {
                appId: app.id,
                userId: userId,
                role: "assistant",
                messages: aiResponse,
            },
        });
        const chatHistory = {chat, botChat}
        return NextResponse.json({ app, chat: chatHistory }, { status: 200 });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}