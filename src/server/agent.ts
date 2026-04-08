import { createOpenAI } from "@ai-sdk/openai";
import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { SYSTEM_PROMPT } from "./agent-core";
import { tools } from './tools';

export class DesignAgent extends AIChatAgent {
    
    async onChatMessage() {
        const openai = createOpenAI({apiKey: this.env.OPENAI_API_KEY});

        const result = streamText({
            model: openai("gpt-4.1-mini"),
            system: SYSTEM_PROMPT,
            tools,
            messages: await convertToModelMessages(this.messages),
            stopWhen: stepCountIs(5)
        })

        return result.toUIMessageStreamResponse();
    }
}