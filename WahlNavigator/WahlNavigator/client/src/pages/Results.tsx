import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ResultMatch from "@/components/ResultMatch";
import ThematicResults from "@/components/ThematicResults";
import UserAnswersList from "@/components/UserAnswersList";
import ResultDetails from "@/components/ResultDetails";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    // Load user answers from localStorage
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    } else {
      // If no answers, redirect to home
      setLocation('/');
    }
  }, [setLocation]);

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['/api/calculate-results'],
    enabled: userAnswers.length > 0,
    queryFn: async () => {
      const response = await fetch('/api/calculate-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAnswers }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      return response.json();
    },
  });

  const handleSaveResults = () => {
    // Create a text version of the results
    if (!results) return;

    let textResults = "Wahl-O-Mat Ergebnisse\n\n";
    
    textResults += "Deine Übereinstimmungen:\n";
    results.partyMatches.forEach((match: any) => {
      textResults += `${match.partyName}: ${match.matchPercentage}%\n`;
    });
    
    textResults += "\nDetaillierte Ergebnisse: https://wahl-o-mat.de/results\n";
    
    // Create and download the file
    const blob = new Blob([textResults], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wahl-o-mat-ergebnisse.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Ergebnisse gespeichert",
      description: "Deine Ergebnisse wurden erfolgreich gespeichert.",
    });
  };

  const handleRestartQuiz = () => {
    // Clear answers and go back to home
    localStorage.removeItem('userAnswers');
    setLocation('/');
  };

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-full h-[600px] rounded-xl mb-8" />
          <Skeleton className="w-full h-[300px] rounded-xl" />
        </div>
      </main>
    );
  }

  if (error || !results) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Fehler beim Laden der Ergebnisse</h2>
          <p className="mb-6">Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.</p>
          <Button onClick={handleRestartQuiz}>
            Test wiederholen
          </Button>
        </div>
      </main>
    );
  }

  const topParty = results.partyMatches[0] || { partyName: '', matchPercentage: 0 };
  
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <section className="fade-in max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">Deine Ergebnisse</h2>
            
            <p className="text-neutral-700 dark:text-neutral-300 mb-8">
              Basierend auf deinen Antworten zu {userAnswers.length} politischen Themen haben wir deine Übereinstimmung mit den Parteien berechnet. Die Ergebnisse spiegeln wider, wie oft du mit dem tatsächlichen Abstimmungsverhalten der Parteien übereinstimmst.
            </p>
            
            <div className="space-y-6 mb-8">
              {results.partyMatches.map((match: any) => (
                <ResultMatch 
                  key={match.partyId}
                  partyName={match.partyName}
                  matchPercentage={match.matchPercentage}
                  partyColor={match.partyColor}
                />
              ))}
            </div>
            
            <ThematicResults thematicResults={results.thematicResults} />
            
            <ResultDetails 
              topParty={topParty.partyName} 
              matchPercentage={topParty.matchPercentage}
              keyMatches={results.keyMatches}
            />
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleSaveResults}
                className="inline-flex items-center justify-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Ergebnisse speichern
              </Button>
              <Button
                variant="outline"
                onClick={handleRestartQuiz}
                className="inline-flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Test wiederholen
              </Button>
            </div>
          </div>
        </div>
        
        <UserAnswersList answers={results.userAnswersWithDetails} />
      </section>
    </main>
  );
}
