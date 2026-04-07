
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';

import { GoldenTestCase, AgentOutput } from './type';
import { Eval } from 'braintrust';
import { runAgent } from '../src/agent-core';
import { createOpenAI } from '@ai-sdk/openai';
import { schemaScorer } from './scores/schema.score';


config({ path: '.dev.vars' });

const testCases = JSON.parse(readFileSync(join('my-evals', 'datasets', 'golden.json'), 'utf8'));

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

Eval<GoldenTestCase[], AgentOutput, GoldenTestCase>("Diagram Agent", {
    data: () => testCases.map((tc) => ({
        input: tc,
        expected: tc,
        metadata: {
            id: tc.id,
            difficulty: tc.difficulty,
            category: tc.category,
        },
    })),
    task: async (testCase) => {
        const result = await runAgent({
            model: openai('gpt-5.4-mini'),
            messages: [{
                role: 'user',
                content: testCase.input,
            }],
        });
        return { text: result.text, elements: result.elements };
    },
    scores: [schemaScorer]
})