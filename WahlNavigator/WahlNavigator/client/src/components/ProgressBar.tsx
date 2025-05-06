interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-700">Frage {currentStep}</span>
        <span className="text-sm font-medium text-neutral-700">{currentStep}/{totalSteps}</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
