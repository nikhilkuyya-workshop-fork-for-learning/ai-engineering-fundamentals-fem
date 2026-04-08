import { routeAgentRequest } from "agents";
import { DesignAgent } from './server/agent';

export { DesignAgent }
interface Env {
  OPENAI_API_KEY: string;
  DesignAgent: DurableObjectNamespace;
}

export default {
  async fetch(_request: Request, _env: Env) {
    return (
      (await routeAgentRequest(_request, _env)) || new Response("Not Found", { status: 404 })
    )
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;


