// src/app/components/Questions.js
'use client';

function BigButton({ label, active, onClick }) {
  return (
    <div
      className={`big-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

function YesNoToggle({ label, value, onChange }) {
  return (
    <div className="mb-2">
      <p>{label}</p>
      <div className="flex gap-2 mt-1">
        <BigButton
          label="Yes"
          active={value === true}
          onClick={() => onChange(true)}
        />
        <BigButton
          label="No"
          active={value === false}
          onClick={() => onChange(false)}
        />
      </div>
    </div>
  );
}

export default function Questions({ answers, updateAnswer }) {
  const handleArVrChoice = (choice) => {
    updateAnswer('arOrVr', choice);
    if (choice === 'AR') {
      updateAnswer('vrChoice', '');
      updateAnswer('canProvideVrAssets', true);
    } else {
      updateAnswer('qrOrImage', '');
      updateAnswer('trackRealWorld', false);
      updateAnswer('canProvideArAssets', true);
    }
  };

  return (
    <div className="space-y-8 text-sm">
      {/* ---------- SECTION 1: AR or VR ---------- */}
      <div>
        <h2 className="section-title">Section 1: AR or VR</h2>
        <p>Required:</p>
        <div className="flex gap-2 mt-1">
          <BigButton
            label="AR"
            active={answers.arOrVr === 'AR'}
            onClick={() => handleArVrChoice('AR')}
          />
          <BigButton
            label="VR"
            active={answers.arOrVr === 'VR'}
            onClick={() => handleArVrChoice('VR')}
          />
        </div>

        {/* If AR */}
        {answers.arOrVr === 'AR' && (
          <div className="sub-question">
            <YesNoToggle
              label="Does it need to track a real world object?"
              value={answers.trackRealWorld}
              onChange={(val) => updateAnswer('trackRealWorld', val)}
            />
            {answers.trackRealWorld && (
              <div className="sub-question">
                <p>Track via QR or Images?</p>
                <div className="flex gap-2 mt-1">
                  <BigButton
                    label="QR"
                    active={answers.qrOrImage === 'QR'}
                    onClick={() => updateAnswer('qrOrImage', 'QR')}
                  />
                  <BigButton
                    label="Images"
                    active={answers.qrOrImage === 'Images'}
                    onClick={() =>
                      updateAnswer('qrOrImage', 'Images')
                    }
                  />
                </div>
                <YesNoToggle
                  label="Can you provide these AR assets?"
                  value={answers.canProvideArAssets}
                  onChange={(val) =>
                    updateAnswer('canProvideArAssets', val)
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* If VR */}
        {answers.arOrVr === 'VR' && (
          <div className="sub-question">
            <p>Do you want 360 video or 3D world?</p>
            <div className="flex gap-2 mt-1">
              <BigButton
                label="360 Video"
                active={answers.vrChoice === '360 Video'}
                onClick={() => updateAnswer('vrChoice', '360 Video')}
              />
              <BigButton
                label="3D World"
                active={answers.vrChoice === '3D World'}
                onClick={() => updateAnswer('vrChoice', '3D World')}
              />
            </div>
            <YesNoToggle
              label="Can you provide these VR assets?"
              value={answers.canProvideVrAssets}
              onChange={(val) =>
                updateAnswer('canProvideVrAssets', val)
              }
            />
          </div>
        )}
      </div>

      {/* ---------- SECTION 2: 3D Assets ---------- */}
      <div>
        <h2 className="section-title">Section 2: 3D Assets</h2>
        <YesNoToggle
          label="Are 3D assets to be used in the experience?"
          value={answers.use3DAssets}
          onChange={(val) => updateAnswer('use3DAssets', val)}
        />
        {answers.use3DAssets && (
          <div className="sub-question">
            <YesNoToggle
              label="Can you provide these 3D assets?"
              value={answers.canProvide3DAssets}
              onChange={(val) =>
                updateAnswer('canProvide3DAssets', val)
              }
            />
          </div>
        )}
      </div>

      {/* ---------- SECTION 3: Animated Characters ---------- */}
      <div>
        <h2 className="section-title">
          Section 3: Animated Characters
        </h2>
        <YesNoToggle
          label="Does the experience include animated characters?"
          value={answers.animatedChars}
          onChange={(val) => updateAnswer('animatedChars', val)}
        />
        {answers.animatedChars && (
          <div className="sub-question">
            <YesNoToggle
              label="Can you provide these character assets?"
              value={answers.canProvideCharAssets}
              onChange={(val) =>
                updateAnswer('canProvideCharAssets', val)
              }
            />
            <YesNoToggle
              label="Does the character have dialogue?"
              value={answers.hasDialogue}
              onChange={(val) => updateAnswer('hasDialogue', val)}
            />
          </div>
        )}
      </div>

      {/* ---------- SECTION 4: Timeline ---------- */}
      <div>
        <h2 className="section-title">Section 4: Timeline</h2>
        <YesNoToggle
          label="Is the experience animated over time?"
          value={answers.animatedOverTime}
          onChange={(val) => updateAnswer('animatedOverTime', val)}
        />
      </div>

      {/* ---------- SECTION 5: 2D Content ---------- */}
      <div>
        <h2 className="section-title">Section 5: 2D Content</h2>
        <YesNoToggle
          label="Will 2D content (text, images, videos) be provided?"
          value={answers.twoDContent}
          onChange={(val) => updateAnswer('twoDContent', val)}
        />
      </div>

      {/* ---------- SECTION 6: Integrations (Tier 3) ---------- */}
      <div>
        <h2 className="section-title">Section 6: Integrations</h2>
        <YesNoToggle
          label="Does the experience integrate with other systems (e.g., ChatGPT)?"
          value={answers.integrations}
          onChange={(val) => updateAnswer('integrations', val)}
        />
      </div>

      {/* ---------- SECTION 7: Interaction (Tier 3) ---------- */}
      <div>
        <h2 className="section-title">Section 7: Interaction</h2>
        <YesNoToggle
          label="Does it require complex interaction (objects respond to clicks, user position, etc.)?"
          value={answers.complexInteraction}
          onChange={(val) => updateAnswer('complexInteraction', val)}
        />
      </div>

      {/* ---------- SECTION 8: Gamification (Tier 3) ---------- */}
      <div>
        <h2 className="section-title">Section 8: Gamification</h2>
        <YesNoToggle
          label="Does it have a gamification element (score, click targets)?"
          value={answers.gamification}
          onChange={(val) => updateAnswer('gamification', val)}
        />
        {answers.gamification && (
          <div className="sub-question">
            <YesNoToggle
              label="Do you want to track user data (leaderboards, high scores)?"
              value={answers.trackUserData}
              onChange={(val) => updateAnswer('trackUserData', val)}
            />
          </div>
        )}
      </div>

      {/* ---------- SECTION 9: Entry Point ---------- */}
      <div>
        <h2 className="section-title">Section 9: Entry Point</h2>
        <p>Choose any that apply (None, QR, NFC):</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <BigButton
            label="None"
            active={answers.entryPoint.includes('None')}
            onClick={() => updateAnswer('entryPoint', ['None'])}
          />
          <BigButton
            label="QR"
            active={answers.entryPoint.includes('QR')}
            onClick={() => {
              if (answers.entryPoint.includes('QR')) {
                updateAnswer(
                  'entryPoint',
                  answers.entryPoint.filter((e) => e !== 'QR')
                );
              } else {
                updateAnswer('entryPoint', [
                  ...answers.entryPoint.filter((e) => e !== 'None'),
                  'QR',
                ]);
              }
            }}
          />
          <BigButton
            label="NFC"
            active={answers.entryPoint.includes('NFC')}
            onClick={() => {
              if (answers.entryPoint.includes('NFC')) {
                updateAnswer(
                  'entryPoint',
                  answers.entryPoint.filter((e) => e !== 'NFC')
                );
              } else {
                updateAnswer('entryPoint', [
                  ...answers.entryPoint.filter((e) => e !== 'None'),
                  'NFC',
                ]);
              }
            }}
          />
        </div>

        {/* If NFC => sub-question for tag type */}
        {answers.entryPoint.includes('NFC') && (
          <div className="sub-question">
            <p>Which NFC Tag type?</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <BigButton
                label="Garment"
                active={answers.nfcTagType === 'Garment'}
                onClick={() => updateAnswer('nfcTagType', 'Garment')}
              />
              <BigButton
                label="On Metal"
                active={answers.nfcTagType === 'On Metal'}
                onClick={() => updateAnswer('nfcTagType', 'On Metal')}
              />
              <BigButton
                label="Standard"
                active={answers.nfcTagType === 'Standard'}
                onClick={() => updateAnswer('nfcTagType', 'Standard')}
              />
              <BigButton
                label="Custom"
                active={answers.nfcTagType === 'Custom'}
                onClick={() => updateAnswer('nfcTagType', 'Custom')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
