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
    trackRealWorld: null,
    qrOrImage: '',
    canProvideArAssets: null,
    vrChoice: '',
    canProvideVrAssets: null,
    use3DAssets: null,
    canProvide3DAssets: null,
    animatedChars: null,
    canProvideCharAssets: null,
    hasDialogue: null,
    animatedOverTime: null,
    twoDContent: null,
    integrations: null,
    complexInteraction: null,
    gamification: null,
    trackUserData: null,
    entryPoint: [],
    nfcTagType: '',
  });

  const [activePanel, setActivePanel] = useState('questions');

  function deriveTier() {
    let tier = 1;
    if (
      answers.hasDialogue === true ||
      answers.animatedOverTime === true
    )
      tier = 2;
    if (
      answers.integrations === true ||
      answers.complexInteraction === true ||
      answers.gamification === true
    ) {
      tier = 3;
    }
    return tier;
  }
  const tier = deriveTier();
  const price = tierPrices[`tier${tier}`] || 0;

  function updateAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    doc.text(`Tier ${tier}, Starting at $${price}`, 20, 30);
    doc.save('immersive-summary.pdf');
  };

  return (
    <>
      {/* The floating black curved navbar */}
      <Navbar />

      {/* The main area below the navbar */}
      <div className="main-content">
        <div className="app-container">
          {/* Desktop layout: side-by-side */}
          <div className="desktop-layout">
            {/* Left panel => summary */}
            <div className="left-panel">
              <div className="panel-scroll-area">
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

            {/* Right panel => questions */}
            <div className="right-panel">
              <div className="panel-scroll-area">
                <Questions
                  answers={answers}
                  updateAnswer={updateAnswer}
                />
              </div>
            </div>
          </div>

          {/* Mobile layout => tab-based */}
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
                      Tier: {tier}
                      <br />
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
