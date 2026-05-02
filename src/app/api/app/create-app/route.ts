import { prisma } from "@/lib/db/prisma";
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
        return NextResponse.json({ app, chat }, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}