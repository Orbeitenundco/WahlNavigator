import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import FilterPanel from "@/components/FilterPanel";
import Disclaimer from "@/components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Play, Info, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const [, setLocation] = useLocation();
  const [questionCount, setQuestionCount] = useState(10);
  const [randomQuestions, setRandomQuestions] = useState(true);

  // Speichere Einstellungen im localStorage
  useEffect(() => {
    localStorage.setItem("questionSettings", JSON.stringify({
      count: questionCount,
      random: randomQuestions
    }));
  }, [questionCount, randomQuestions]);
  
  const startQuiz = () => {
    setLocation("/quiz");
  };

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <section className="fade-in">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-4">Willkommen zum Wahl-O-Mat</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6">
              Finde heraus, welche Partei am besten zu deinen politischen Ansichten passt - basierend auf tatsächlichen Abstimmungen der Parteien in Deutschland der letzten 10 Jahre.
            </p>
            <div className="bg-neutral-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">So funktioniert's:</h3>
              <ol className="list-decimal list-inside text-neutral-700 dark:text-neutral-300 space-y-1">
                <li>Beantworte Fragen zu politischen Themen</li>
                <li>Wähle aus, wie wichtig dir jedes Thema ist</li>
                <li>Sieh deine Übereinstimmung mit den Parteien</li>
                <li>Erfahre Details zu den tatsächlichen Abstimmungen</li>
              </ol>
            </div>
            
            <div className="mb-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="question-count" className="font-medium dark:text-neutral-200">Anzahl der Fragen: {questionCount}</Label>
                </div>
                <Slider 
                  id="question-count"
                  min={5} 
                  max={30} 
                  step={5} 
                  value={[questionCount]} 
                  onValueChange={(value) => setQuestionCount(value[0])} 
                  className="py-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="random-questions"
                  checked={randomQuestions}
                  onCheckedChange={setRandomQuestions}
                />
                <Label htmlFor="random-questions" className="flex items-center gap-2 cursor-pointer font-medium dark:text-neutral-200">
                  <Shuffle className="h-4 w-4" />
                  Zufällige Fragen
                </Label>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={startQuiz}
                className="inline-flex items-center justify-center"
              >
                <Play className="mr-2 h-4 w-4" />
                Quiz starten
              </Button>
              <Link href="/learn-more">
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Mehr erfahren
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <Disclaimer />
        
        <FilterPanel />
      </section>
    </main>
  );
}
