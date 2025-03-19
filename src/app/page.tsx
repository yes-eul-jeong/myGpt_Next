"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/styles/globals.css";

import CustomPopup from "./components/CustomPopup";
import ModifyPopup from "./components/ModifyPopup";

interface Chat {
  role: string;
  content: string;
}
console.log("관심가져주셔서 감사합니다. 해당 서비스는 이력서를 위해 만든 서비스이며, APIKey는 제 사비로 충전하여 사용하고있습니다. 너무 많은 사용은 자제해주시기 바랍니다. 방문해주셔서 감사합니다 좋은 하루 되세요!")

export default function HomePage() {
  const textEl = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>("");
  const [dontShowModi, setDontShowModi] = useState<boolean>(true);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([
    {
      role: "system",
      content: "",
    },
  ]);
  const [textareaHeight, setTextareaHeight] = useState<string>("4em");

  useEffect(() => {
    const systemMessage = localStorage.getItem("systemMessage") || "";
    setChats([
      {
        role: "system",
        content: systemMessage,
      },
    ]);
  }, []); 

  const handleClosePopup = () => {
    setIsPopup(false);
  };
  const handleCloseModiPopup = () => {
    setDontShowModi(false);
    // console.log("API Key in modi", localStorage.getItem("APIkey"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const systemMessage = localStorage.getItem("systemMessage") || "";
    const newChats: Chat[] = [
      ...chats,
      { role: "system", content: systemMessage },
      { role: "user", content: text },
      { role: "assistant", content: "생성중" },
    ];
    setChats(newChats);
  
    const topP = localStorage.getItem("TopP") || "0.5";
    const temperature = localStorage.getItem("Temperature") || "1";
    const apiKey = localStorage.getItem("APIkey") || "";
  
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chats: newChats,
        topP,
        temperature,
        apiKey,
      }),
    });
    // console.log("api호출응답상태코드:", response.status);
    
    const data = await response.json();
    
    // console.log("api호출응답내용 data:", data);
    // console.log("api호출응답내용:", data.content);
    if (response.ok) {
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChats.length - 1] = {
          role: "assistant",
          content: data.content,  // 받아온 데이터로 변경
        };
        return updatedChats;
      });
    } else if (!response.ok) {
      console.error("Error:", data);
      return;
    }
  
    setText("");
    textEl.current?.focus();
  };
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    const lines = text.split("\n").length;
    if (lines < 3) setTextareaHeight("4em");
    else if (lines <= 5) setTextareaHeight(`${lines + 1 }em`);
    else setTextareaHeight("6em");
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <main className="p-3">
      <div className="header-wrap">
        <h1>Seul&apos;s chatGPT!</h1>
        <button onClick={() => setIsPopup(true)} className="btn btn-secondary">
          커스텀
        </button>
      </div>

      <div className="chat-container">
        {chats.map((chat, index) =>
          chat.role !== "system" ? (
            <div key={index} className={`chat-bubble ${chat.role}`}>
              <p dangerouslySetInnerHTML={{ __html: chat.content }} />
            </div>
          ) : null
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <textarea
          ref={textEl}
          value={text}
          className="mb-3 form-control"
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.target.value)}
          placeholder="질문을 입력해주세요"
          style={{ height: textareaHeight }}
          onInput={adjustHeight}
        ></textarea>
        <button type="submit" className="btn btn-primary">
          보내기
        </button>
      </form>

      {isPopup && (<CustomPopup onClose={handleClosePopup}systemMessage={localStorage.getItem("systemMessage")|| ""}/>) }
      {dontShowModi && (<ModifyPopup onClose={handleCloseModiPopup} />)}
    </main>
  );
}
