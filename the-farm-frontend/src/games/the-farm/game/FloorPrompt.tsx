import { useState } from "react";
import { FLOOR_DESIGNS } from "../lore/floors";

type FloorPromptProps = {
    floor: number;
    onAttempt: (choiceIndex: number, isCorrect: boolean) => void;
    busy: boolean;
};

export function FloorPrompt({ floor, onAttempt, busy }: FloorPromptProps) {
    const design = FLOOR_DESIGNS.find((d) => d.id === floor);

    if (!design) {
        if (floor > 10) return <div className="tf-prompt-box"><h3>Dungeon Cleared</h3><p>You have ascended.</p></div>;
        return <div className="tf-prompt-box"><h3>Loading Floor {floor}...</h3></div>;
    }

    return (
        <div className="tf-prompt-box">
            <div className="tf-prompt-header">
                <span className="tf-prompt-floor">FLOOR {floor}</span>
                <span className="tf-prompt-tech">{design.proofStack}</span>
            </div>
            <h3 className="tf-prompt-title">{design.title}</h3>
            <p className="tf-prompt-copy">{design.copy}</p>

            <div className="tf-prompt-challenge">
                <p className="tf-prompt-question">{design.question}</p>
                {design.hint && <p className="tf-prompt-copy">Hint: {design.hint}</p>}
                <div className="tf-prompt-options">
                    {design.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className="tf-option-btn"
                            disabled={busy}
                            onClick={() => onAttempt(idx, idx === design.correctOptionIndex)}
                        >
                            <div className="tf-option-label">{opt.label}</div>
                            <div className="tf-option-text">{opt.text}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* Add these styles to gameCanvas.css later if needed, or inline them */
/* 
.tf-prompt-box {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  color: #fff;
  font-family: 'Inter', sans-serif;
}
.tf-prompt-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
}
.tf-prompt-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #fff;
}
.tf-prompt-copy {
  font-size: 14px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 24px;
}
.tf-prompt-question {
  font-weight: 500;
  color: #ddd;
  margin-bottom: 12px;
}
.tf-prompt-options {
  display: grid;
  gap: 8px;
}
.tf-option-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.tf-option-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
.tf-option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tf-option-label {
  font-weight: 700;
  margin-right: 12px;
  color: #888;
  width: 20px;
}
.tf-option-text {
  font-size: 14px;
}
*/
