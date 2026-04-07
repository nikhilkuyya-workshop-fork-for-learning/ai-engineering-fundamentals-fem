import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { runAgent } from '../src/agent-core';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const uuid = crypto.randomUUID();

const countOfFilesInFolder = readdirSync('my-evals/results','utf8').length;
console.log(countOfFilesInFolder);


async function main() {
    const testCases = JSON.parse(readFileSync('my-evals/datasets/golden.json', 'utf8'));
    for (const testCase of testCases) {
        const result = await runAgent({
            model: openai('gpt-5.4-mini'),
            messages: [{
                role: 'user',
                content: testCase.input,
            }],
        });
        // copy the json object to clipboard
        writeFileSync(`my-evals/results/output-${countOfFilesInFolder}-${testCase.id}.json`, JSON.stringify(result, null, 2));
        console.log(`Results written to my-evals/results/output-${countOfFilesInFolder}-${testCase.id}.json`);
    }
}

main().catch((err) => {console.error(err); process.exit(1);});