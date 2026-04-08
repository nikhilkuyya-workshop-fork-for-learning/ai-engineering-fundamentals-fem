import { tool } from "ai";
import z from 'zod';
import { FILLSTYLE, TEXT_ALIGN_TYPE, TYPE } from "./agent-core";


export const tools = {
    generateDiagram: tool({
        description: "Generate the complete diagram for exclidraw with shapes, lines and text.",
        inputSchema: z.object({
            elements: z.array(
                z.object({
                    id: z.string().describe("unique identifier"),
                    type: z.enum(TYPE).describe("define the element type in the diagram"),
                    x: z.number().describe("x starting position"),
                    y: z.number().describe("y starting position"),
                    width: z.number().describe("Width of element"),
                    height: z.number().describe("Height of element"),
                    strokeColor: z.string().default("#1e1e1e").describe("stroke color of the element"),
                    backgroundColor: z.string().default("transparent").describe("background color of element"),
                    fillStyle: z.enum(FILLSTYLE).default("solid").describe("fill style"),
                    strokeWidth: z.number().default(2).describe("stroke size"),
                    roughness: z.number().default(1).describe("clean or sketchy with 0 or 1 respectively"),
                    opacity: z.number().default(100).describe("element how it is defined the looking"),
                    text: z.string().optional().describe("text Content is applicable for text elements"),
                    fontSize: z.number().default(20).describe("applicable for text element"),
                    textAlign: z.enum(TEXT_ALIGN_TYPE).describe("where to align the text if text element").optional().nullable(),
                    fontFamily: z.number().default(1).describe("1=Virgil, 2=Helvetica, 3=Cascadia"),
                    points: z.array(z.array(z.number())).describe("array of [x,y] points for (arrow/line) elements.Each point is a two number array applicalbe for line elements"),
                    startBinding: z.object({
                        elementId: z.string(),
                        focus: z.number(),
                        gap: z.number()
                    }).optional().describe("Bind arrow start to an element"),
                    endBinding: z.object({
                        elementId: z.string(),
                        focus: z.number(),
                        gap: z.number()
                    }).optional().describe("bind arrow end to an element")
                }).describe("element object which is drawn")
            ).describe("Array of excalidraw elements that make up the diagram")
        }),
        execute: async (input) => {
            console.log("--------------------------------")
            console.log(JSON.stringify(input, null, 2))
            console.log("--------------------------------")
            return input;
        }
    }),
    modifyDiagram: tool({
        description: 'Modify the partial part for the exclidraw diagram',
        inputSchema: z.object({
            elementIds: z.array(z.string().describe('id for elements needed to modify')).describe("all the ids array for modifications")
        }),
        execute: async (input) => {
            console.log("--------------------------------")
            console.log(JSON.stringify(input, null, 2))
            console.log("--------------------------------")
            return input;
        }
    })
}