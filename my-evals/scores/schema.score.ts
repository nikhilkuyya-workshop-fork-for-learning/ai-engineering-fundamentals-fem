import type { EvalScorer } from "braintrust";
import { AgentOutput, GoldenTestCase } from "../type";

const requiredFields = ["id", "type", "x", "y", "width", "height"];
const validTypes = ["rectangle", "ellipse", "diamond", "text", "arrow", "line"];

export const schemaScorer: EvalScorer<GoldenTestCase, AgentOutput, GoldenTestCase> = ({output}) => {
    const { elements } = output;

    if(!Array.isArray(elements)) {
        return { name: 'Schema', score: 0, metadata: { reason: 'elements is not an array' } };
    }

    if(elements.length === 0) {
        return {name: "Schema", score: 0, metadata: { reason: 'no elements produced' } };
    }

    for(const element of elements) {
        if(!element || typeof element !== 'object') {
            return { name: 'Schema', score: 0, metadata: { reason: 'element is not an object' } };
        }
        requiredFields.forEach((field) => {
            if(!element[field]) {
                return { name: 'Schema', score: 0, metadata: { reason: `element ${element.id} missing field: ${field}` } };
            }
        });

        if(!validTypes.includes(element.type)) {
            return { name: 'Schema', score: 0, metadata: { reason: `element ${element.id} has invalid name: ${element.type}` } };
        }
    }

    return { name: 'Schema', score: 1, metadata: { elementCount: elements.length } };
}