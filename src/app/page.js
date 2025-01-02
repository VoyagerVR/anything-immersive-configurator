'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import Summary from './components/Summary';

import jsPDF from 'jspdf';
import tierPrices from '../../public/pricing.json';

export default function HomePage() {
  const [answers, setAnswers] = useState({
    arOrVr: '',
    trackRealWorld: false,
    qrOrImage: '',
    canProvideArAssets: true,
    vrChoice: '',
    canProvideVrAssets: true,
    use3DAssets: false,
    canProvide3DAssets: true,
    animatedChars: false,
    canProvideCharAssets: true,
    hasDialogue: false,
    animatedOverTime: false,
    twoDContent: false,
    integrations: false,
    complexInteraction: false,
    gamification: false,
    trackUserData: false,
    // Define as an ARRAY to avoid "undefined" error
    entryPoint: [],
    nfcTagType: '',
  });

  // Mobile tab
  const [activePanel, setActivePanel] = useState('questions');

  // Tier logic
  function deriveTier() {
    let tier = 1;
    if (answers.hasDialogue || answers.animatedOverTime) tier = 2;
    if (
      answers.integrations ||
      answers.complexInteraction ||
      answers.gamification
    )
      tier = 3;
    return tier;
  }
  const tier = deriveTier();
  const tierKey = `tier${tier}`;
  const price = tierPrices[tierKey] || 0;

  function updateAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    doc.setFontSize(12);
    doc.text(`Tier ${tier}, Starting at $${price}`, 20, 30);
    // Add lines about the user's selections if you want
    doc.save('immersive-summary.pdf');
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="app-container">
          {/* Desktop layout */}
          <div className="desktop-layout">
            <div className="left-panel">
              <div className="left-panel-scroll">
                <Summary answers={answers} />
              </div>
              <div className="left-panel-footer">
                <div className="text-sm">
                  Tier: {tier} <br />
                  Starting at: ${price}
                </div>
                <button
                  className="px-4 py-2 bg-accent text-black rounded font-semibold"
                  onClick={handleExportPDF}
                >
                  Export as PDF
                </button>
              </div>
            </div>
            <div className="right-panel">
              <Questions
                answers={answers}
                updateAnswer={updateAnswer}
              />
            </div>
          </div>

          {/* Mobile layout */}
          <div className="mobile-layout">
            <div className="mobile-tabs">
              <div
                className={`mobile-tab ${
                  activePanel === 'questions' ? 'active' : ''
                }`}
                onClick={() => setActivePanel('questions')}
              >
                Questions
              </div>
              <div
                className={`mobile-tab ${
                  activePanel === 'summary' ? 'active' : ''
                }`}
                onClick={() => setActivePanel('summary')}
              >
                Summary
              </div>
            </div>

            <div className="mobile-view">
              {activePanel === 'questions' && (
                <div className="mobile-content-scroll">
                  <Questions
                    answers={answers}
                    updateAnswer={updateAnswer}
                  />
                </div>
              )}
              {activePanel === 'summary' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 mobile-content-scroll">
                    <Summary answers={answers} />
                  </div>
                  <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm">
                      Tier: {tier} <br />
                      Starting at: ${price}
                    </div>
                    <button
                      className="px-4 py-2 bg-accent text-black rounded font-semibold"
                      onClick={handleExportPDF}
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
