import { CheckCircle } from "lucide-react";

interface KeyMatch {
  title: string;
  description: string;
}

interface ResultDetailsProps {
  topParty: string;
  matchPercentage: number;
  keyMatches: KeyMatch[];
}

export default function ResultDetails({ topParty, matchPercentage, keyMatches }: ResultDetailsProps) {
  if (!topParty || keyMatches.length === 0) return null;
  
  return (
    <div className="bg-primary-light/10 p-5 rounded-lg mb-8 border border-primary-light/30">
      <h3 className="font-semibold text-lg text-primary mb-3">
        Die wichtigsten Übereinstimmungen mit {topParty} ({matchPercentage}%)
      </h3>
      <ul className="space-y-3">
        {keyMatches.map((match, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="text-success mr-2 flex-shrink-0 h-5 w-5" />
            <div>
              <p className="font-medium">{match.title}</p>
              <p className="text-sm text-neutral-700">{match.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
