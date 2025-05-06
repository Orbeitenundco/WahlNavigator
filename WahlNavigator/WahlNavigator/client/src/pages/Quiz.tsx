import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

type UserAnswer = {
  questionId: number;
  answer: "agree" | "neutral" | "disagree" | "skip";
  importance: "low" | "medium" | "high";
};

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const queryClient = useQueryClient();
  
  // Lade die Benutzereinstellungen für Fragen aus dem localStorage
  const [questionSettings, setQuestionSettings] = useState({
    count: 10,
    random: true
  });
  
  // Einen zufälligen Wert hinzufügen, der sich bei jedem Quizstart ändert,
  // um sicherzustellen, dass keine gecachten Fragen wiederverwendet werden
  const [quizId] = useState(() => Math.random().toString(36).substring(2, 15));
  
  useEffect(() => {
    const savedSettings = localStorage.getItem("questionSettings");
    if (savedSettings) {
      setQuestionSettings(JSON.parse(savedSettings));
    }
    
    // Beim Laden der Komponente den Fragen-Cache leeren,
    // damit bei jedem Quizstart neue Fragen geladen werden
    queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
  }, [queryClient]);
  
  const { data: questions, isLoading, error } = useQuery({
    // Füge quizId als Teil des queryKey hinzu, damit jeder Quizstart als einzigartige Abfrage behandelt wird
    queryKey: ['/api/questions', questionSettings, quizId],
    queryFn: async () => {
      // Lade Fragen mit den Einstellungen vom Server
      const url = new URL('/api/questions', window.location.origin);
      url.searchParams.append('count', questionSettings.count.toString());
      url.searchParams.append('randomize', questionSettings.random.toString());
      // Füge einen Cache-Buster-Parameter hinzu, um sicherzustellen, dass der Browser keine gecachten Ergebnisse verwendet
      url.searchParams.append('t', Date.now().toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Fragen');
      }
      
      return await response.json();
    },
    // Deaktiviere Caching für diese Abfrage
    staleTime: 0,
    cacheTime: 0
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Fehler beim Laden der Fragen",
        description: "Bitte versuche es später erneut.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleAnswerSubmit = (answer: UserAnswer) => {
    // Erstelle eine aktualisierte Antwortliste
    let updatedAnswers: UserAnswer[] = [...userAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionId === answer.questionId);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = answer;
    } else {
      updatedAnswers = [...updatedAnswers, answer];
    }
    
    // Aktualisiere den State
    setUserAnswers(updatedAnswers);

    // Move to next question or results page
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Speichere die aktualisierte Antwortliste (mit der aktuellen Antwort)
      localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers));
      setLocation('/results');
    }
  };

  const handleGoBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setLocation('/');
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-6">
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-6" />
        </div>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="w-full h-[500px] rounded-xl" />
        </div>
      </main>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Keine Fragen verfügbar</h2>
          <p className="mb-6">Es konnten keine Fragen geladen werden. Bitte versuche es später erneut.</p>
          <button 
            onClick={() => setLocation('/')}
            className="px-4 py-2 bg-primary text-white font-medium rounded-md"
          >
            Zurück zur Startseite
          </button>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ProgressBar 
        currentStep={currentQuestionIndex + 1}
        totalSteps={questions.length}
      />
      
      <QuestionCard
        question={currentQuestion}
        onSubmit={handleAnswerSubmit}
        onBack={handleGoBack}
        defaultValues={existingAnswer}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </main>
  );
}
