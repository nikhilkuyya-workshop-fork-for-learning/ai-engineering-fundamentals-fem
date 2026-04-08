import { useState, useCallback, useEffect, useRef } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import Canvas from "./components/Canvas";
import ChatPanel from "./components/chat/ChatPanel";
import "./App.css";
import { useAgent } from 'agents/react';
import { useAgentChat } from "@cloudflare/ai-chat/react";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
const sessionId = crypto.randomUUID();

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleApiReady = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
  }, []);
  const appliedToolCalls = useRef<Set<string>>(new Set());

  const agent = useAgent({ agent: 'design-agent' , name: sessionId });
  const { messages,sendMessage,status } = useAgentChat({agent});

  useEffect(() => { 

    if(!excalidrawAPI) return;

    for(const message of messages) {
      if(message.role !== 'assistant') continue;
      for(const part of message.parts ?? []) {
        if(part.type !== 'tool-generateDiagram'){ continue;}

        if(part.state !== 'output-available') continue;
        if(appliedToolCalls.current.has(part.toolCallId)) continue;

        if(part.type === 'tool-generateDiagram') {
          appliedToolCalls.current.add(part.toolCallId);
          const output = part.output as {elements?: unknown};
          const skeletonElements = output?.elements;
          
          if(Array.isArray(skeletonElements) && skeletonElements.length > 0) {
           const elements = convertToExcalidrawElements(skeletonElements,{ regenerateIds: false})
           excalidrawAPI.updateScene({elements});
           excalidrawAPI.scrollToContent(elements, { fitToContent: true});
          }
        }

      }
    }


  },[messages, excalidrawAPI])

  return (
    <div className={`app ${theme}`}>
      <div className="canvas-container">
        <Canvas onApiReady={handleApiReady} onThemeChange={setTheme} />
      </div>
      <ChatPanel messages={messages} sendMessage={sendMessage} status={status} />
    </div>
  );
}
