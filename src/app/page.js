'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Questions from './components/Questions';
import Summary from './components/Summary';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import tierPrices from '../../public/pricing.json';

export default function HomePage() {
  const [answers, setAnswers] = useState({
    arOrVr: '',
    trackRealWorld: null,
    qrOrImage: '',
    canProvideArAssets: null,
    canProvideTrackingImages: null,
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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Required minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activePanel === 'questions') {
      setActivePanel('summary');
    } else if (isRightSwipe && activePanel === 'summary') {
      setActivePanel('questions');
    }
  };

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

  const handleExportPDF = async ({ answers, tier, price }) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    try {
      // Load logo using fetch
      const logoResponse = await fetch('/logo.png');
      const logoBlob = await logoResponse.blob();
      const base64Logo = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(logoBlob);
      });

      // Add black banner
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, doc.internal.pageSize.width, 100, 'F');

      // Add logo to the right corner of banner with padding
      doc.addImage(
        `data:image/png;base64,${base64Logo}`,
        'PNG',
        doc.internal.pageSize.width - 160,
        20,
        120,
        60
      );

      // Add title in white within banner
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Immersive Experience Summary', 40, 60);

      // Reset text color to black for content
      doc.setTextColor(0, 0, 0);
      let startY = 140;

      // Prepare features data for table
      const featuresData = [];

      if (answers.arOrVr) featuresData.push(['Type', answers.arOrVr]);
      if (answers.arOrVr === 'AR' && answers.trackRealWorld) {
        featuresData.push(['Track Real World Object', 'Yes']);
        if (answers.qrOrImage)
          featuresData.push(['AR Method', answers.qrOrImage]);
      }
      if (answers.arOrVr === 'VR' && answers.vrChoice) {
        featuresData.push(['VR Content', answers.vrChoice]);
      }
      if (answers.use3DAssets)
        featuresData.push(['3D Assets', 'Yes']);
      if (answers.animatedChars) {
        featuresData.push(['Animated Characters', 'Yes']);
        if (answers.hasDialogue)
          featuresData.push(['Character Dialogue', 'Yes']);
      }
      if (answers.animatedOverTime)
        featuresData.push(['Animated Over Time', 'Yes']);
      if (answers.twoDContent)
        featuresData.push(['2D Content', 'Yes']);
      if (answers.integrations)
        featuresData.push(['Integrations', 'Yes']);
      if (answers.complexInteraction)
        featuresData.push(['Complex Interaction', 'Yes']);
      if (answers.gamification) {
        featuresData.push(['Gamification', 'Yes']);
        if (answers.trackUserData)
          featuresData.push(['Track User Data', 'Yes']);
      }
      if (answers.entryPoint?.length > 0) {
        featuresData.push([
          'Entry Point',
          answers.entryPoint.join(', '),
        ]);
        if (
          answers.entryPoint.includes('NFC') &&
          answers.nfcTagType
        ) {
          featuresData.push(['NFC Tag Type', answers.nfcTagType]);
        }
      }

      // Add features table
      doc.autoTable({
        startY: startY,
        head: [['Feature', 'Details']],
        body: featuresData,
        headStyles: {
          fillColor: [255, 140, 0],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 11,
          cellPadding: 5,
        },
        margin: { left: 40, right: 40 },
        theme: 'grid',
      });

      // Prepare commissioned items data
      const commissionItems = [];
      if (
        answers.arOrVr === 'AR' &&
        answers.trackRealWorld === true &&
        answers.qrOrImage === 'Images' &&
        answers.canProvideTrackingImages === false
      ) {
        commissionItems.push(['Tracking images for AR']);
      }
      if (
        answers.arOrVr === 'AR' &&
        answers.trackRealWorld === true &&
        answers.canProvideArAssets === false
      ) {
        commissionItems.push(['AR tracking assets']);
      }
      if (
        answers.arOrVr === 'VR' &&
        answers.canProvideVrAssets === false
      ) {
        commissionItems.push(['VR environment assets']);
      }
      if (
        answers.use3DAssets === true &&
        answers.canProvide3DAssets === false
      ) {
        commissionItems.push(['3D Assets']);
      }
      if (
        answers.animatedChars === true &&
        answers.canProvideCharAssets === false
      ) {
        commissionItems.push(['Character 3D Assets']);
      }

      // Add commissioned items table if there are items
      if (commissionItems.length > 0) {
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 30,
          head: [['Items to be Commissioned']],
          body: commissionItems,
          headStyles: {
            fillColor: [255, 140, 0],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold',
          },
          styles: {
            fontSize: 11,
            cellPadding: 5,
          },
          margin: { left: 40, right: 40 },
          theme: 'grid',
        });
      }

      // Add tier and price at bottom with some padding
      const finalY = doc.lastAutoTable.finalY + 50;

      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(`Tier ${tier}`, 40, finalY);

      doc.setFontSize(18);
      doc.setFont(undefined, 'normal');
      doc.text(`Starting at: $${price}`, 40, finalY + 30);

      doc.save('immersive-summary.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      handleExportPDFWithoutLogo({ answers, tier, price });
    }
  };

  // Fallback function for when logo loading fails
  const handleExportPDFWithoutLogo = ({ answers, tier, price }) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    // Add black banner without logo
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.width, 100, 'F');

    // Add title in white within banner
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Immersive Experience Summary', 40, 60);

    // Reset text color to black for content
    doc.setTextColor(0, 0, 0);
    let startY = 140;

    // Prepare features data for table
    const featuresData = [];

    if (answers.arOrVr) featuresData.push(['Type', answers.arOrVr]);
    if (answers.arOrVr === 'AR' && answers.trackRealWorld) {
      featuresData.push(['Track Real World Object', 'Yes']);
      if (answers.qrOrImage)
        featuresData.push(['AR Method', answers.qrOrImage]);
    }
    if (answers.arOrVr === 'VR' && answers.vrChoice) {
      featuresData.push(['VR Content', answers.vrChoice]);
    }
    if (answers.use3DAssets) featuresData.push(['3D Assets', 'Yes']);
    if (answers.animatedChars) {
      featuresData.push(['Animated Characters', 'Yes']);
      if (answers.hasDialogue)
        featuresData.push(['Character Dialogue', 'Yes']);
    }
    if (answers.animatedOverTime)
      featuresData.push(['Animated Over Time', 'Yes']);
    if (answers.twoDContent) featuresData.push(['2D Content', 'Yes']);
    if (answers.integrations)
      featuresData.push(['Integrations', 'Yes']);
    if (answers.complexInteraction)
      featuresData.push(['Complex Interaction', 'Yes']);
    if (answers.gamification) {
      featuresData.push(['Gamification', 'Yes']);
      if (answers.trackUserData)
        featuresData.push(['Track User Data', 'Yes']);
    }
    if (answers.entryPoint?.length > 0) {
      featuresData.push([
        'Entry Point',
        answers.entryPoint.join(', '),
      ]);
      if (answers.entryPoint.includes('NFC') && answers.nfcTagType) {
        featuresData.push(['NFC Tag Type', answers.nfcTagType]);
      }
    }

    // Add features table
    doc.autoTable({
      startY: startY,
      head: [['Feature', 'Details']],
      body: featuresData,
      headStyles: {
        fillColor: [255, 140, 0],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 11,
        cellPadding: 5,
      },
      margin: { left: 40, right: 40 },
      theme: 'grid',
    });

    // Prepare commissioned items data
    const commissionItems = [];
    if (
      answers.arOrVr === 'AR' &&
      answers.trackRealWorld === true &&
      answers.qrOrImage === 'Images' &&
      answers.canProvideTrackingImages === false
    ) {
      commissionItems.push(['Tracking images for AR']);
    }
    if (
      answers.arOrVr === 'AR' &&
      answers.trackRealWorld === true &&
      answers.canProvideArAssets === false
    ) {
      commissionItems.push(['AR tracking assets']);
    }
    if (
      answers.arOrVr === 'VR' &&
      answers.canProvideVrAssets === false
    ) {
      commissionItems.push(['VR environment assets']);
    }
    if (
      answers.use3DAssets === true &&
      answers.canProvide3DAssets === false
    ) {
      commissionItems.push(['3D Assets']);
    }
    if (
      answers.animatedChars === true &&
      answers.canProvideCharAssets === false
    ) {
      commissionItems.push(['Character 3D Assets']);
    }

    // Add commissioned items table if there are items
    if (commissionItems.length > 0) {
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [['Items to be Commissioned']],
        body: commissionItems,
        headStyles: {
          fillColor: [255, 140, 0],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 11,
          cellPadding: 5,
        },
        margin: { left: 40, right: 40 },
        theme: 'grid',
      });
    }

    // Add tier and price at bottom with some padding
    const finalY = doc.lastAutoTable.finalY + 50;

    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(`Tier ${tier}`, 40, finalY);

    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.text(`Starting at: $${price}`, 40, finalY + 30);

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
                  onClick={() =>
                    handleExportPDF({ answers, tier, price })
                  }
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
                    setActivePanel={setActivePanel}
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
                      onClick={() =>
                        handleExportPDF({ answers, tier, price })
                      }
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
