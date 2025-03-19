// src/app/api/openai.ts (서버 코드)
import { NextResponse } from "next/server";
import markdownit from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/hybrid.css";

const MASTER_API_KEY = process.env.MASTER_API_KEY; 
const MASTER_WORD = process.env.MASTER_WORD;

export async function POST(req: Request) {
  const { chats, topP, temperature, apiKey } = await req.json();

  let usedApiKey = apiKey;

  // console.log("API key:", apiKey, "Master API key:", MASTER_API_KEY);
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 400 });
    
  } else if (apiKey === MASTER_API_KEY) {
    usedApiKey = process.env.OPENAI_API_KEY || "";
    // console.log("Using master API key");
  } else if (apiKey === MASTER_WORD) {
    usedApiKey = process.env.HAN_KEY || "";
    // console.log("Using master WORD key");
  }
  // console.log('최종사용키',usedApiKey);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${encodeURI(usedApiKey)}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-4",
      messages: chats,
      temperature: parseFloat(temperature),
      top_p: parseFloat(topP),
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullContent = "";

  const md = markdownit({
    html: true,
    highlight: (str: string, lang: string) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value;
      }
      return "";
    },
  });

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop()!;

      for (const line of lines) {
        if (line.trim().startsWith("data:")) {
          const messageData = line.slice("data:".length).trim();
          if (messageData === "[DONE]") {
            reader.cancel();
            break;
          }
          try {
            const parsedMessage = JSON.parse(messageData);
            if (parsedMessage.choices && parsedMessage.choices.length > 0) {
              const delta = parsedMessage.choices[0].delta;
              if (delta && delta.content) {
                fullContent += delta.content;
              }
            }
          } catch (e) {
            console.error("Parsing error:", e);
          }
        }
      }
    }
  }

  const htmlString = md.render(fullContent);
  return NextResponse.json({ content: htmlString });
}
