'use client';

import { useEffect, useRef } from 'react';

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
    <div className="mb-3">
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

function isSection1Answered(answers) {
  return answers.arOrVr !== '';
}
function isSection2Answered(answers) {
  return answers.use3DAssets !== null;
}
function isSection3Answered(answers) {
  return answers.animatedChars !== null;
}
function isSection4Answered(answers) {
  return answers.animatedOverTime !== null;
}
function isSection5Answered(answers) {
  return answers.twoDContent !== null;
}
function isSection6Answered(answers) {
  return answers.integrations !== null;
}
function isSection7Answered(answers) {
  return answers.complexInteraction !== null;
}
function isSection8Answered(answers) {
  return answers.gamification !== null;
}

export default function Questions({
  answers,
  updateAnswer,
  setActivePanel,
}) {
  const sectionRefs = useRef({});

  useEffect(() => {
    // Find the first unanswered section
    let nextSection;
    if (!isSection1Answered(answers)) nextSection = 'section1';
    else if (!isSection2Answered(answers)) nextSection = 'section2';
    else if (!isSection3Answered(answers)) nextSection = 'section3';
    else if (!isSection4Answered(answers)) nextSection = 'section4';
    else if (!isSection5Answered(answers)) nextSection = 'section5';
    else if (!isSection6Answered(answers)) nextSection = 'section6';
    else if (!isSection7Answered(answers)) nextSection = 'section7';
    else if (!isSection8Answered(answers)) nextSection = 'section8';
    else if (answers.gamification && !answers.trackUserData)
      nextSection = 'section9';

    // Scroll to the next unanswered section if it exists
    if (nextSection && sectionRefs.current[nextSection]) {
      sectionRefs.current[nextSection].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [answers]);

  const handleArVrChoice = (choice) => {
    updateAnswer('arOrVr', choice);
  };

  // Helper function to check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return (
      isSection8Answered(answers) && // Check through Section 8
      // If gamification is true, check trackUserData
      (answers.gamification === false ||
        answers.trackUserData !== null) &&
      // Check entry point
      answers.entryPoint.length > 0 &&
      // If NFC is selected, check tag type
      (!answers.entryPoint.includes('NFC') ||
        answers.nfcTagType !== '')
    );
  };

  return (
    <div className="space-y-8 text-sm">
      <div
        className="section-block"
        ref={(el) => (sectionRefs.current.section1 = el)}
      >
        <h2 className="section-title">Section 1: AR or VR</h2>
        <p className="mb-2">
          Decide whether your experience is totally virtual, or uses
          the real world view from the users camera.
        </p>
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

        {answers.arOrVr === 'AR' && (
          <div className="sub-question">
            <YesNoToggle
              label="Does it need to track a real world object?"
              value={answers.trackRealWorld}
              onChange={(val) => updateAnswer('trackRealWorld', val)}
            />
            {answers.trackRealWorld === true && (
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
                {answers.qrOrImage === 'Images' && (
                  <div className="sub-question">
                    <YesNoToggle
                      label="Can you provide the tracking images?"
                      value={answers.canProvideTrackingImages}
                      onChange={(val) =>
                        updateAnswer('canProvideTrackingImages', val)
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isSection1Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section2 = el)}
        >
          <h2 className="section-title">Section 2: 3D Assets</h2>
          <YesNoToggle
            label="Are 3D assets to be used in the experience?"
            value={answers.use3DAssets}
            onChange={(val) => updateAnswer('use3DAssets', val)}
          />
          {answers.use3DAssets === true && (
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
      )}

      {isSection2Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section3 = el)}
        >
          <h2 className="section-title">
            Section 3: Animated Characters
          </h2>
          <YesNoToggle
            label="Does the experience include animated characters?"
            value={answers.animatedChars}
            onChange={(val) => updateAnswer('animatedChars', val)}
          />
          {answers.animatedChars === true && (
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
      )}

      {isSection3Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section4 = el)}
        >
          <h2 className="section-title">Section 4: Timeline</h2>
          <YesNoToggle
            label="Is the experience animated over time?"
            value={answers.animatedOverTime}
            onChange={(val) => updateAnswer('animatedOverTime', val)}
          />
        </div>
      )}

      {isSection4Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section5 = el)}
        >
          <h2 className="section-title">Section 5: 2D Content</h2>
          <YesNoToggle
            label="Will 2D content (text, images, videos) be provided?"
            value={answers.twoDContent}
            onChange={(val) => updateAnswer('twoDContent', val)}
          />
        </div>
      )}

      {isSection5Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section6 = el)}
        >
          <h2 className="section-title">Section 6: Integrations</h2>
          <YesNoToggle
            label="Does the experience integrate with other systems (e.g., ChatGPT)?"
            value={answers.integrations}
            onChange={(val) => updateAnswer('integrations', val)}
          />
        </div>
      )}

      {isSection6Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section7 = el)}
        >
          <h2 className="section-title">Section 7: Interaction</h2>
          <YesNoToggle
            label="Does it require complex interaction (objects respond to clicks, user position, etc.)?"
            value={answers.complexInteraction}
            onChange={(val) =>
              updateAnswer('complexInteraction', val)
            }
          />
        </div>
      )}

      {isSection7Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section8 = el)}
        >
          <h2 className="section-title">Section 8: Gamification</h2>
          <YesNoToggle
            label="Does it have a gamification element (score, click targets)?"
            value={answers.gamification}
            onChange={(val) => updateAnswer('gamification', val)}
          />
          {answers.gamification === true && (
            <div className="sub-question">
              <YesNoToggle
                label="Do you want to track user data (leaderboards, high scores)?"
                value={answers.trackUserData}
                onChange={(val) => updateAnswer('trackUserData', val)}
              />
            </div>
          )}
        </div>
      )}

      {isSection8Answered(answers) && (
        <div
          className="section-block"
          ref={(el) => (sectionRefs.current.section9 = el)}
        >
          <h2 className="section-title">Section 9: Entry Point</h2>
          <p>Choose any that apply (None, QR, NFC):</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <BigButton
              label="None"
              active={answers.entryPoint?.includes('None')}
              onClick={() => updateAnswer('entryPoint', ['None'])}
            />
            <BigButton
              label="QR"
              active={answers.entryPoint?.includes('QR')}
              onClick={() => {
                if (answers.entryPoint?.includes('QR')) {
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
              active={answers.entryPoint?.includes('NFC')}
              onClick={() => {
                if (answers.entryPoint?.includes('NFC')) {
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
          {answers.entryPoint?.includes('NFC') && (
            <div className="sub-question">
              <p>Which NFC Tag type?</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <BigButton
                  label="Garment"
                  active={answers.nfcTagType === 'Garment'}
                  onClick={() =>
                    updateAnswer('nfcTagType', 'Garment')
                  }
                />
                <BigButton
                  label="On Metal"
                  active={answers.nfcTagType === 'On Metal'}
                  onClick={() =>
                    updateAnswer('nfcTagType', 'On Metal')
                  }
                />
                <BigButton
                  label="Standard"
                  active={answers.nfcTagType === 'Standard'}
                  onClick={() =>
                    updateAnswer('nfcTagType', 'Standard')
                  }
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
      )}

      {areAllQuestionsAnswered() && (
        <div className="md:hidden mt-8 pb-8 flex justify-center">
          <button
            onClick={() => setActivePanel('summary')}
            className="px-6 py-3 bg-accent text-black rounded-lg font-semibold 
                     shadow-lg hover:bg-opacity-90 transition-colors"
          >
            View Summary →
          </button>
        </div>
      )}
    </div>
  );
}
