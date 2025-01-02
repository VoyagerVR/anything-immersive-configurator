'use client';

import { FaCheck } from 'react-icons/fa';

/**
 * This summary ONLY lists the chosen or "Yes" items + commission list.
 * Tier/Price/Export are pinned in footers on desktop or mobile.
 */
export default function Summary({ answers }) {
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

  return (
    <div className="space-y-2">
      {/* AR / VR */}
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

      {/* 3D Assets */}
      {answers.use3DAssets && renderYes('3D Assets')}

      {/* Animated Characters */}
      {answers.animatedChars && renderYes('Animated Characters')}
      {answers.animatedChars &&
        answers.hasDialogue &&
        renderYes('Character Dialogue')}

      {/* Timeline */}
      {answers.animatedOverTime && renderYes('Animated Over Time')}

      {/* 2D Content */}
      {answers.twoDContent && renderYes('2D Content')}

      {/* Integrations => Tier 3 */}
      {answers.integrations && renderYes('Integrations (Tier 3)')}

      {/* Interaction => Tier 3 */}
      {answers.complexInteraction &&
        renderYes('Complex Interaction (Tier 3)')}

      {/* Gamification => Tier 3 */}
      {answers.gamification && renderYes('Gamification (Tier 3)')}
      {answers.gamification &&
        answers.trackUserData &&
        renderYes('Track User Data')}

      {/* Entry Point */}
      {answers.entryPoint.length > 0 &&
        renderYesChoice('Entry Point', answers.entryPoint.join(', '))}
      {answers.entryPoint.includes('NFC') &&
        answers.nfcTagType &&
        renderYesChoice('NFC Tag Type', answers.nfcTagType)}

      {/* Commission Items if any */}
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
