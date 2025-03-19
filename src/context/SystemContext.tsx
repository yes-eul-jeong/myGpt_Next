"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';


// Context 생성
interface SystemContextProps {
  systemMessage: string;
  APIkey: string;
  TopP: number;
  Temperature: number;
  setSystemMessage: (message: string) => void;
  setAPIkey: (key: string) => void;
  setTopP: (value: number) => void;
  setTemperature: (value: number) => void;
}

const SystemContext = createContext<SystemContextProps | undefined>(undefined);

// Context를 사용하기 위한 custom hook
export const useSystemContext = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystemContext must be used within a SystemProvider');
    // console.log('useSystemContext must be used within a SystemProvider');
  }
  return context;
};

// Provider 컴포넌트
export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [systemMessage, setSystemMessage] = useState<string>('');
  const [APIkey, setAPIkey] = useState<string>('');
  const [TopP, setTopP] = useState<number>(0.5);
  const [Temperature, setTemperature] = useState<number>(1);

  return (
    <SystemContext.Provider
      value={{
        systemMessage,
        APIkey,
        TopP,
        Temperature,
        setSystemMessage,
        setAPIkey,
        setTopP,
        setTemperature,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};
