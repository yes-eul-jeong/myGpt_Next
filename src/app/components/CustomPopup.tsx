"use client";
import React, { useState } from 'react';
import { useSystemContext } from "../../context/SystemContext";
import './CustomPopup.css';

interface CustomPopupProps {
  systemMessage: string;
  onClose: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ systemMessage: initialSystemMessage, onClose }) => {
  const { TopP, Temperature, APIkey, setTopP, setTemperature, setAPIkey } = useSystemContext();

  const [systemMessage, setSystemMessage] = useState(initialSystemMessage);

  const handleClosePopup = () => {
    localStorage.setItem('systemMessage', systemMessage); 
    localStorage.setItem('APIkey', APIkey); 
    localStorage.setItem('TopP', TopP.toString());
    localStorage.setItem('Temperature', Temperature.toString()); 
    // console.log(APIkey); // API key 확인

    onClose();
  };

  return (
    <div className="popup-wrap">
      <div className="popup-box">
        <h2>커스텀하기</h2>
        <section>
          <h3>System Message</h3>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            placeholder="시스템 메시지를 입력해주세요"
            className='system-message'
          />
        </section>
        <section>
          <h3>API key</h3>
          <input
            type="text"
            value={APIkey}
            onChange={(e) => setAPIkey(e.target.value)}
            placeholder="API key를 입력해주세요"
          />
        </section>
        <div className="section">
          <div className="parameter">
            <h4>
              Top-P <span>{TopP}</span>
            </h4>
            <div className="range-label">
              <p>일관성</p>
              <p>다양성</p>
            </div>
            <input
              type="range"
              id="TopP"
              max="1"
              min="0"
              step="0.1"
              value={TopP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
            />
          </div>
          <div className="parameter">
            <h4>
              Temperature <span>{Temperature}</span>
            </h4>
            <div className="range-label">
              <p>정확성</p>
              <p>창의성</p>
            </div>
            <input
              type="range"
              id="Temperature"
              min="0"
              max="2"
              step="0.1"
              value={Temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="button-wrap">
          <button onClick={handleClosePopup}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
