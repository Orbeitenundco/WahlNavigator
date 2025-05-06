interface ResultMatchProps {
  partyName: string;
  matchPercentage: number;
  partyColor: string;
}

export default function ResultMatch({ partyName, matchPercentage, partyColor }: ResultMatchProps) {
  // Map party colors to TailwindCSS color classes
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-600';
      case 'red':
        return 'bg-red-600';
      case 'black':
        return 'bg-black';
      case 'yellow':
        return 'bg-yellow-500';
      case 'purple':
        return 'bg-purple-700';
      case 'blue':
        return 'bg-blue-600';
      default:
        return 'bg-neutral-500';
    }
  };

  const colorClass = getColorClass(partyColor);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full ${colorClass} mr-3`}></div>
          <span className="font-medium">{partyName}</span>
        </div>
        <span className="font-bold">{matchPercentage}%</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-3">
        <div 
          className={`${colorClass} h-3 rounded-full`} 
          style={{ width: `${matchPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
