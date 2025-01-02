// src/app/components/Summary.js
'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import jsPDF from 'jspdf';
import tierPrices from '../../../public/pricing.json';

export default function Summary({ answers, tier }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const key = `tier${tier}`;
    setPrice(tierPrices[key] || 0);
  }, [tier]);

  // Commission logic
  const commissionItems = [];
  if (
    answers.arOrVr === 'AR' &&
    answers.trackRealWorld &&
    !answers.canProvideArAssets
  ) {
    commissionItems.push('AR tracking assets');
  }
  if (answers.arOrVr === 'VR' && !answers.canProvideVrAssets) {
    commissionItems.push('VR environment assets');
  }
  if (answers.use3DAssets && !answers.canProvide3DAssets) {
    commissionItems.push('3D Assets');
  }
  if (answers.animatedChars && !answers.canProvideCharAssets) {
    commissionItems.push('Character 3D Assets');
  }

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    doc.setFontSize(12);
    doc.text(
      `Anything Immersive Summary (Tier ${tier}, Starting at $${price})`,
      20,
      30
    );

    let yPos = 60;
    const lines = getSelectedLines(
      answers,
      tier,
      commissionItems,
      price
    );
    lines.forEach((line) => {
      doc.text(`- ${line}`, 20, yPos);
      yPos += 20;
    });

    doc.save('immersive-summary.pdf');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Selected items */}
      <div className="flex-1 overflow-auto text-sm">
        {renderYesChoice('AR or VR', answers.arOrVr)}
        {answers.arOrVr === 'AR' &&
          answers.trackRealWorld &&
          renderYes('Track Real World Object')}
        {answers.arOrVr === 'AR' &&
          answers.qrOrImage &&
          renderYesChoice('AR method', answers.qrOrImage)}
        {answers.arOrVr === 'VR' &&
          answers.vrChoice &&
          renderYesChoice('VR Content', answers.vrChoice)}

        {answers.use3DAssets && renderYes('3D Assets')}
        {answers.animatedChars && renderYes('Animated Characters')}
        {answers.hasDialogue && renderYes('Character Dialogue')}
        {answers.animatedOverTime && renderYes('Animated Over Time')}
        {answers.twoDContent && renderYes('2D Content')}
        {answers.integrations && renderYes('Integrations (Tier 3)')}
        {answers.complexInteraction &&
          renderYes('Complex Interaction (Tier 3)')}
        {answers.gamification && renderYes('Gamification (Tier 3)')}
        {answers.gamification &&
          answers.trackUserData &&
          renderYes('Track User Data')}

        {answers.entryPoint.length > 0 &&
          renderYesChoice(
            'Entry Point',
            answers.entryPoint.join(', ')
          )}
        {answers.entryPoint.includes('NFC') &&
          answers.nfcTagType &&
          renderYesChoice('NFC Tag Type', answers.nfcTagType)}

        {/* Commission items */}
        {commissionItems.length > 0 && (
          <div className="commission-list">
            <div className="commission-list-title">
              <FaCheck />
              <span>Items to be Commissioned</span>
            </div>
            <ul className="list-disc list-inside">
              {commissionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing at bottom, above Export button */}
      <div className="mt-4 text-sm">
        <p>
          Tier:{' '}
          <span className="text-accent font-semibold">{tier}</span>
        </p>
        <p>
          Starting at:
          <span className="text-accent font-semibold ml-1">
            ${price}
          </span>
        </p>
      </div>

      <div className="mt-2">
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-accent text-black font-semibold rounded"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}

/** Renders a "Yes" item in green. */
function renderYes(label) {
  return (
    <div className="summary-item green" key={label}>
      <FaCheck />
      <span className="summary-item-title">{label}</span>
    </div>
  );
}

/** Renders a multi-choice item in blue. */
function renderYesChoice(label, choice) {
  const key = `${label}-${choice}`;
  return (
    <div className="summary-item blue" key={key}>
      <FaCheck />
      <span className="summary-item-title">
        {label}: {choice}
      </span>
    </div>
  );
}

/** Lines for PDF. */
function getSelectedLines(answers, tier, commissionItems, price) {
  const lines = [];
  lines.push(`Tier: ${tier} (Starting at $${price})`);

  if (answers.arOrVr) lines.push(`Platform: ${answers.arOrVr}`);
  if (answers.arOrVr === 'AR' && answers.trackRealWorld)
    lines.push('Real World Object Tracking');
  if (answers.arOrVr === 'AR' && answers.qrOrImage)
    lines.push(`AR Method: ${answers.qrOrImage}`);
  if (answers.arOrVr === 'VR' && answers.vrChoice)
    lines.push(`VR Content: ${answers.vrChoice}`);

  if (answers.use3DAssets) lines.push('3D Assets');
  if (answers.animatedChars) {
    lines.push('Animated Characters');
    if (answers.hasDialogue) lines.push('Character Dialogue');
  }
  if (answers.animatedOverTime) lines.push('Animated Over Time');
  if (answers.twoDContent) lines.push('2D Content');
  if (answers.integrations) lines.push('Integrations (Tier 3)');
  if (answers.complexInteraction)
    lines.push('Complex Interaction (Tier 3)');
  if (answers.gamification) {
    lines.push('Gamification (Tier 3)');
    if (answers.trackUserData) lines.push('Track User Data');
  }
  if (answers.entryPoint.length > 0) {
    lines.push(`Entry Point: ${answers.entryPoint.join(', ')}`);
  }
  if (answers.entryPoint.includes('NFC') && answers.nfcTagType) {
    lines.push(`NFC Tag Type: ${answers.nfcTagType}`);
  }
  if (commissionItems.length > 0) {
    lines.push(
      `Items to be Commissioned: ${commissionItems.join(', ')}`
    );
  }

  return lines;
}
