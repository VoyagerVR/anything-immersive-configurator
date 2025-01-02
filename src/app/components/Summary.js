'use client';

import { FaCheck } from 'react-icons/fa';

export default function Summary({ answers }) {
  const commissionItems = [];
  if (
    answers.arOrVr === 'AR' &&
    answers.trackRealWorld === true &&
    answers.canProvideArAssets === false
  ) {
    commissionItems.push('AR tracking assets');
  }
  if (
    answers.arOrVr === 'VR' &&
    answers.canProvideVrAssets === false
  ) {
    commissionItems.push('VR environment assets');
  }
  if (
    answers.use3DAssets === true &&
    answers.canProvide3DAssets === false
  ) {
    commissionItems.push('3D Assets');
  }
  if (
    answers.animatedChars === true &&
    answers.canProvideCharAssets === false
  ) {
    commissionItems.push('Character 3D Assets');
  }

  return (
    <div className="space-y-2">
      {renderYesChoice('AR or VR', answers.arOrVr)}
      {answers.arOrVr === 'AR' &&
        answers.trackRealWorld === true &&
        renderYes('Track Real World Object')}
      {answers.arOrVr === 'AR' &&
        answers.qrOrImage &&
        renderYesChoice('AR method', answers.qrOrImage)}
      {answers.arOrVr === 'VR' &&
        answers.vrChoice &&
        renderYesChoice('VR Content', answers.vrChoice)}

      {answers.use3DAssets === true && renderYes('3D Assets')}
      {answers.animatedChars === true &&
        renderYes('Animated Characters')}
      {answers.animatedChars === true &&
        answers.hasDialogue === true &&
        renderYes('Character Dialogue')}
      {answers.animatedOverTime === true &&
        renderYes('Animated Over Time')}
      {answers.twoDContent === true && renderYes('2D Content')}
      {answers.integrations === true &&
        renderYes('Integrations (Tier 3)')}
      {answers.complexInteraction === true &&
        renderYes('Complex Interaction (Tier 3)')}
      {answers.gamification === true &&
        renderYes('Gamification (Tier 3)')}
      {answers.gamification === true &&
        answers.trackUserData === true &&
        renderYes('Track User Data')}

      {answers.entryPoint?.length > 0 &&
        renderYesChoice('Entry Point', answers.entryPoint.join(', '))}
      {answers.entryPoint?.includes('NFC') &&
        answers.nfcTagType &&
        renderYesChoice('NFC Tag Type', answers.nfcTagType)}

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
  );
}

function renderYes(label) {
  return (
    <div className="summary-item green" key={label}>
      <FaCheck />
      <span className="summary-item-title">{label}</span>
    </div>
  );
}

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
