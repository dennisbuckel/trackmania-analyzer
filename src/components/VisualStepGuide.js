import React, { useState, useEffect } from 'react';

const VisualStepGuide = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to COTD Analyzer! 🏁',
      description: 'Analyze your Trackmania Cup of the Day performance like a pro',
      visual: (
        <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="text-center">
            <div className="text-4xl mb-2">🏁</div>
            <div className="text-lg font-bold">COTD Analyzer</div>
          </div>
        </div>
      ),
      action: null
    },
    {
      id: 'search-profile',
      title: 'Step 1: Search Your Profile',
      description: (
        <span>
          Go to{' '}
          <a 
            href="https://trackmania.io/#/players" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            trackmania.io
          </a>
          {' '}and search for your profile name
        </span>
      ),
      visual: (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={`${process.env.PUBLIC_URL}/tutorial1-searchname.jpg`} 
              alt="Step 1: Search your profile on trackmania.io" 
              className="w-full h-56 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300 cursor-pointer"
              loading="lazy"
              onClick={() => window.open(`${process.env.PUBLIC_URL}/tutorial1-searchname.jpg`, '_blank')}
            />
          </div>
          <div className="flex justify-center">
            <a 
              href="https://trackmania.io/#/players" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            >
              <span className="mr-2 text-lg">🔍</span>
              Search Profile
            </a>
          </div>
        </div>
      ),
      action: 'search'
    },
    {
      id: 'goto-cotd',
      title: 'Step 2: Go to Cup of the Day',
      description: 'Click on "Cup of the Day" in your profile to see your results',
      visual: (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={`${process.env.PUBLIC_URL}/tutorial2-gotocotd.jpg`} 
              alt="Step 2: Click on Cup of the Day in your profile" 
              className="w-full h-56 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300 cursor-pointer"
              loading="lazy"
              onClick={() => window.open(`${process.env.PUBLIC_URL}/tutorial2-gotocotd.jpg`, '_blank')}
            />
          </div>
          <div className="flex justify-center">
            <div className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg">
              <span className="mr-2 text-lg">🏆</span>
              Open COTD Results
            </div>
          </div>
        </div>
      ),
      action: 'navigate'
    },
    {
      id: 'copy-data',
      title: 'Step 3: Copy Your Data',
      description: 'Select the complete table and copy it (Ctrl+C)',
      visual: (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src={`${process.env.PUBLIC_URL}/tutorial2-copydata.jpg`} 
              alt="Step 3: Select and copy the complete COTD table" 
              className="w-full h-56 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300 cursor-pointer"
              loading="lazy"
              onClick={() => window.open(`${process.env.PUBLIC_URL}/tutorial2-copydata.jpg`, '_blank')}
            />
          </div>
          <div className="flex justify-center">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg">
              <span className="mr-2 text-lg">📋</span>
              Copy Data (Ctrl+C)
            </div>
          </div>
        </div>
      ),
      action: 'copy'
    },
    {
      id: 'paste-data',
      title: 'Step 4: Paste Your Data',
      description: 'Paste the copied data into the analyzer text area',
      visual: (
        <div className="space-y-4">
          <div className="bg-white border-2 border-blue-300 rounded-lg p-6 min-h-32">
            <div className="text-gray-400 mb-3 font-medium">Paste your COTD data here...</div>
            <div className="text-sm font-mono text-gray-600 space-y-2">
              <div className="animate-pulse bg-gray-100 p-2 rounded">Cup of the Day | Map | Division | Division Rank | Rank | Qualification</div>
              <div className="animate-pulse delay-100 bg-gray-100 p-2 rounded">COTD 2025-07-26 #1 | Flow State | 12 | 1st / 46 | 705th / 2134</div>
              <div className="animate-pulse delay-200 bg-gray-100 p-2 rounded">COTD 2025-07-25 #1 | Speed Map | 8 | 3rd / 52 | 234th / 1987</div>
              <div className="animate-pulse delay-300 bg-gray-100 p-2 rounded">COTD 2025-07-24 #1 | Tech Track | 16 | 12th / 45 | 892nd / 2156</div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg">
              <span className="mr-2 text-lg">📝</span>
              Paste (Ctrl+V)
            </div>
          </div>
        </div>
      ),
      action: 'paste'
    },
    {
      id: 'process-data',
      title: 'Step 5: Process Data',
      description: 'Click the "Process Data" button to analyze your results',
      visual: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-3 font-medium">Your data is ready:</div>
            <div className="space-y-2">
              <div className="text-base text-green-600 font-semibold flex items-center">
                <span className="mr-2 text-lg">✓</span>
                25 races found
              </div>
              <div className="text-base text-green-600 font-semibold flex items-center">
                <span className="mr-2 text-lg">✓</span>
                Data format validated
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center transform hover:scale-105 transition-all shadow-lg">
              <span className="mr-3 text-xl">⚡</span>
              Process Data
            </button>
          </div>
        </div>
      ),
      action: 'process'
    },
    {
      id: 'explore-results',
      title: 'Step 6: Explore Your Results',
      description: 'View your statistics, charts, and detailed race analysis',
      visual: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">2.1</div>
              <div className="text-sm text-blue-500 font-medium">Avg Division</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">8.1%</div>
              <div className="text-sm text-green-500 font-medium">Best Result</div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Performance Trend</div>
              <div className="text-sm text-green-600 font-bold">↗ Improving</div>
            </div>
            <div className="h-12 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg flex items-end justify-between px-2">
              <div className="w-3 bg-red-400 h-6 rounded-t"></div>
              <div className="w-3 bg-yellow-400 h-7 rounded-t"></div>
              <div className="w-3 bg-yellow-400 h-5 rounded-t"></div>
              <div className="w-3 bg-green-400 h-9 rounded-t"></div>
              <div className="w-3 bg-green-400 h-10 rounded-t"></div>
            </div>
          </div>
        </div>
      ),
      action: 'explore'
    },
    {
      id: 'ready',
      title: 'You\'re Ready! 🚀',
      description: 'Start analyzing your COTD performance and discover insights!',
      visual: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-4">
            <div className="font-bold text-lg">All Set!</div>
            <div className="text-sm opacity-90">Ready to analyze your performance</div>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      ),
      action: 'complete'
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
    }, 200);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 200);
  };

  const skipTour = () => {
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium">
                {currentStep + 1}/{steps.length}
              </div>
              <div className="text-lg font-bold">
                {currentStepData.title}
              </div>
            </div>
            <button 
              onClick={skipTour}
              className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Visual Content */}
        <div className="p-6">
          <div className="mb-4">
            {currentStepData.visual}
          </div>
          
          <div className="text-gray-600 text-center mb-6 leading-relaxed">
            {currentStepData.description}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-500 w-6' 
                    : index < currentStep 
                      ? 'bg-green-400' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              ← Back
            </button>

            <button
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Skip Tour
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 flex items-center"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <span className="mr-2">🚀</span>
                  Let's Go!
                </>
              ) : (
                <>
                  Next
                  <span className="ml-2">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualStepGuide;
