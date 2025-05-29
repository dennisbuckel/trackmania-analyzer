// src/components/OnboardingTour.js
import React, { useState, useEffect } from 'react';

const OnboardingTour = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Willkommen zum COTD Analyzer! 🏁",
      content: "Analysiere deine Trackmania Cup of the Day Performance wie ein Profi. Lass uns eine kurze Tour machen!",
      target: null,
      position: "center"
    },
    {
      title: "Daten importieren 📊",
      content: "Kopiere deine COTD-Ergebnisse aus Trackmania oder trackmania.io und füge sie hier ein. Der Parser erkennt das Format automatisch!",
      target: ".data-import-area",
      position: "bottom"
    },
    {
      title: "Live-Statistiken 📈",
      content: "Hier siehst du sofort deine wichtigsten Kennzahlen: Durchschnittsdivision, beste Platzierungen und Verbesserungstrends.",
      target: ".stats-overview",
      position: "bottom"
    },
    {
      title: "Interaktive Charts 📊",
      content: "Visualisiere deine Performance mit verschiedenen Chart-Typen. Zoome, filtere und entdecke Trends in deinen Daten!",
      target: ".charts-section",
      position: "top"
    },
    {
      title: "Detaillierte Tabelle 📋",
      content: "Durchsuche und sortiere alle deine Rennen. Jede Spalte ist sortierbar und die Tabelle ist vollständig durchsuchbar.",
      target: ".results-table",
      position: "top"
    },
    {
      title: "Du bist startklar! 🚀",
      content: "Alle Features sind jetzt freigeschaltet. Viel Spaß beim Analysieren deiner COTD-Performance!",
      target: null,
      position: "center"
    }
  ];

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 300);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const skipTour = () => {
    onComplete();
  };

  useEffect(() => {
    if (isVisible && steps[currentStep].target) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tour-highlight');
        
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300">
        
        {/* Tour Modal */}
        <div className={`fixed z-50 transition-all duration-300 ${
          currentStepData.position === 'center' 
            ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            : 'top-4 right-4'
        } ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md border-l-4 border-blue-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <span className="text-blue-600 font-bold text-sm">
                    {currentStep + 1}/{steps.length}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {currentStepData.title}
                </h3>
              </div>
              <button 
                onClick={skipTour}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Zurück
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={skipTour}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Überspringen
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {currentStep === steps.length - 1 ? 'Fertig!' : 'Weiter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for highlighting */}
      <style jsx>{`
        .tour-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default OnboardingTour;
