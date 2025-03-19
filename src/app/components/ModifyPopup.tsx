'use client';
import React, { useState, useEffect } from "react";
import './CustomPopup.css';
import { useSystemContext } from "../../context/SystemContext";


interface ModifyPopupProps {
  onClose: (dontShowModi: boolean) => void;
}

const ModifyPopup: React.FC<ModifyPopupProps> = ({ onClose }) => {
  const [dontShowModi, setDontShowModi] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { APIkey, setAPIkey } = useSystemContext();

  useEffect(() => {
    const savedState = localStorage.getItem("dontShowModi");
    if (savedState === "true") {
      setDontShowModi(true);
      setIsVisible(false); // 팝업을 숨김
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("dontShowModi", String(dontShowModi));
    localStorage.setItem("APIkey", APIkey);
    setIsVisible(false); // 팝업 닫기
    onClose(dontShowModi); // 부모 컴포넌트에 상태 전달
  };

  return (
    isVisible && (
      <div className="popup-wrap">
        <div className="popup-box">
          <h2>방문해주셔서 감사합니다!</h2>
          <section>
            <h3>API Key</h3>
            <p>API Key가 있으시다면 키를, 없으시다면 제 이름을 한글로 입력해주세요</p>
            <input
              type="text"
              value={APIkey}
              onChange={(e) =>setAPIkey(e.target.value)}
              placeholder="API key를 입력해주세요"
            />
          </section>

          <div className="button-wrap">
            <button onClick={closePopup}>확인</button>
          </div>

          <section>
            <label htmlFor="dont-show">
              <input
                type="checkbox"
                id="dont-show"
                checked={dontShowModi}
                onChange={() => setDontShowModi(!dontShowModi)}
              />
              다시 보지 않기
            </label>
          </section>
        </div>
      </div>
    )
  );
};

export default ModifyPopup;
