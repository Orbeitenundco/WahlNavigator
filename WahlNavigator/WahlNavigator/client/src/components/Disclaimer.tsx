import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Disclaimer() {
  return (
    <Alert className="my-4 bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300 font-medium">Hinweis zur Nutzung</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-200">
        Der Wahl-O-Mat dient lediglich als Orientierungshilfe und erhebt keinen Anspruch auf Vollständigkeit oder garantierte Richtigkeit. 
        Die hier dargestellten Informationen könnten Fehler enthalten. Bitte überprüfen Sie die Angaben und recherchieren Sie selbst, bevor 
        Sie wichtige Entscheidungen treffen. Die Nutzung erfolgt auf eigene Verantwortung.
      </AlertDescription>
    </Alert>
  );
}