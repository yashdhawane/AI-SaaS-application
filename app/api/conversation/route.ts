
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
//import { Configuration, OpenAIApi} from "openai"
//v3
/*const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
*/

//v4
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


export async function POST(req:Request) {
    try{
        const { userId } = await auth();
        console.log("userId",userId);
        const body = await req.json();
        const {messages} = body;

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        if(!openai.apiKey){
            return new NextResponse("OpenAI API Key not Configured", {status:500});
        }

        if(!messages){
            return new NextResponse("Messages are required", {status:400});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages});
        return NextResponse.json(response.choices[0].message);

    }catch(error){
        console.log("[CONVERSATION_ERROR",error);
        return new NextResponse("Internal error",{status:500});
    }
}