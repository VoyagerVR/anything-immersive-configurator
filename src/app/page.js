// src/app/page.js
'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import Summary from './components/Summary';

export default function HomePage() {
  const [answers, setAnswers] = useState({
    // Same structure as before
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
    entryPoint: [],
    nfcTagType: '',
  });

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

  function updateAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="layout-container">
          <section className="left-panel">
            <Summary answers={answers} tier={tier} />
          </section>

          <section className="right-panel">
            <Questions
              answers={answers}
              updateAnswer={updateAnswer}
            />
          </section>
        </div>
      </div>
    </>
  );
}
