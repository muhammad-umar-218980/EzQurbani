import React from 'react';

const DeliveryTracker = ({ status }) => {
  const steps = ['Slaughtered', 'Packaged', 'Delivered'];
  
  const getStepStatus = (stepIndex) => {
    const statuses = {
      'pending': -1,
      'prepared': 1,
      'out_for_delivery': 2,
      'delivered': 3
    };
    const currentStep = statuses[status] || 0;
    
    if (stepIndex < currentStep) return 'bg-green-500 text-white';
    if (stepIndex === currentStep) return 'bg-indigo-500 text-white animate-pulse';
    return 'bg-gray-200 text-gray-500';
  };

  return (
    <div className="flex items-center justify-between w-full mt-6">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${getStepStatus(index)}`}>
              {index + 1}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-600">{step}</span>
          </div>
          {index < steps.length - 1 && (
             <div className={`flex-1 h-2 mx-4 rounded ${getStepStatus(index).includes('bg-green') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DeliveryTracker;