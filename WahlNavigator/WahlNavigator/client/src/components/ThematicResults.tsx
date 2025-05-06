interface ThematicResult {
  topic: string;
  partyResults: {
    partyName: string;
    matchPercentage: number;
  }[];
}

interface ThematicResultsProps {
  thematicResults: ThematicResult[];
}

export default function ThematicResults({ thematicResults }: ThematicResultsProps) {
  if (!thematicResults || thematicResults.length === 0) return null;
  
  return (
    <div className="bg-neutral-100 p-5 rounded-lg mb-8">
      <h3 className="font-semibold text-lg text-neutral-900 mb-3">Übereinstimmung nach Themenbereichen</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thematicResults.map((result, index) => (
          <div key={index}>
            <h4 className="font-medium mb-2">{result.topic}</h4>
            <div className="space-y-2">
              {result.partyResults
                .sort((a, b) => b.matchPercentage - a.matchPercentage)
                .slice(0, 3) // Show top 3 matches for each topic
                .map((partyResult, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span>{partyResult.partyName}</span>
                    <span className="font-medium">{partyResult.matchPercentage}%</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
