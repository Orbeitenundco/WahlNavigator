import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ArrowRight, ChevronDown, Check, Minus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Question, PartyVote } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: any) => void;
  onBack: () => void;
  defaultValues?: {
    answer: "agree" | "neutral" | "disagree" | "skip";
    importance: "low" | "medium" | "high";
  };
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export default function QuestionCard({
  question,
  onSubmit,
  onBack,
  defaultValues,
  isFirstQuestion,
  isLastQuestion
}: QuestionCardProps) {
  const [answer, setAnswer] = useState<"agree" | "neutral" | "disagree" | "skip">(
    defaultValues?.answer || "skip"
  );
  const [importance, setImportance] = useState<"low" | "medium" | "high">(
    defaultValues?.importance || "medium"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      questionId: question.id,
      answer,
      importance
    });
  };

  // Determine icon based on topic
  const getTopicIcon = (topic: string | undefined) => {
    if (!topic) return "article";
    
    switch (topic.toLowerCase()) {
      case "umwelt & klima":
        return "eco";
      case "sicherheit":
        return "security";
      case "wirtschaft":
        return "business";
      case "soziales":
        return "people";
      case "bildung":
        return "school";
      case "migration":
        return "public";
      default:
        return "article";
    }
  };

  // Get icon component based on topic name
  const getIconComponent = () => {
    // This is a simplification - in a real app you would have proper icon components
    return <span className="material-icons">{getTopicIcon(question.topic)}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 p-1 rounded-full bg-accent-light dark:bg-accent text-white mr-4">
              {getIconComponent()}
            </div>
            <div>
              <div className="text-xs font-medium text-accent dark:text-accent-light mb-1">
                {question.topic} | {question.parliament} | {question.year}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{question.title}</h3>
              <p className="text-neutral-700 dark:text-neutral-300">{question.description}</p>
            </div>
          </div>



          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Wie stimmst du?</h4>
          <div className="space-y-3 mb-8">
            <RadioGroup value={answer} onValueChange={(val: any) => setAnswer(val)} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agree" id="agree" />
                <Label htmlFor="agree" className="flex-1 p-4 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <span className="font-medium">Dafür - {question.agreeText}</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral" className="flex-1 p-4 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <span className="font-medium">Neutral/Enthaltung</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disagree" id="disagree" />
                <Label htmlFor="disagree" className="flex-1 p-4 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <span className="font-medium">Dagegen - {question.disagreeText}</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skip" id="skip" />
                <Label htmlFor="skip" className="flex-1 p-4 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <span className="font-medium">Überspringen - Diese Frage nicht bewerten</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Wie wichtig ist dir dieses Thema?</h4>
            <RadioGroup 
              value={importance} 
              onValueChange={(val: any) => setImportance(val)}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex flex-col items-center">
                <RadioGroupItem value="low" id="imp-low" />
                <Label htmlFor="imp-low" className="flex flex-col items-center w-full p-3 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <ArrowLeft className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mb-1" />
                  <span className="text-sm font-medium">Weniger wichtig</span>
                </Label>
              </div>
              <div className="flex flex-col items-center">
                <RadioGroupItem value="medium" id="imp-medium" />
                <Label htmlFor="imp-medium" className="flex flex-col items-center w-full p-3 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <Minus className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mb-1" />
                  <span className="text-sm font-medium">Normal</span>
                </Label>
              </div>
              <div className="flex flex-col items-center">
                <RadioGroupItem value="high" id="imp-high" />
                <Label htmlFor="imp-high" className="flex flex-col items-center w-full p-3 border border-neutral-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700 transition dark:text-white">
                  <ArrowRight className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mb-1 rotate-90" />
                  <span className="text-sm font-medium">Sehr wichtig</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
            <CollapsibleTrigger className="text-sm font-medium text-primary dark:text-primary-light cursor-pointer flex items-center">
              Mehr Informationen zur Abstimmung
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 p-4 bg-neutral-50 dark:bg-gray-700 rounded-lg text-sm dark:text-neutral-200">
              <div dangerouslySetInnerHTML={{ __html: question.detailedInfo }} />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Quelle: <a href={question.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-light hover:underline">{question.sourceDescription}</a></p>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="border-t border-neutral-200 dark:border-gray-700 px-6 py-4 bg-neutral-50 dark:bg-gray-800 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isFirstQuestion}
            className="px-4 py-2 text-neutral-700 dark:text-neutral-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zurück
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary dark:bg-primary-light text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center"
          >
            {isLastQuestion ? "Abschließen" : "Weiter"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
