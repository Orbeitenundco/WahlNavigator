import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { de } from "date-fns/locale";
// Erstellen wir unser eigenes Validierungsschema, da wir keinen direkten Zugriff auf das Backend-Schema haben
import { z } from "zod";

// Validierungsschema für das Gästebuch-Formular
const guestbookValidationSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte gültige E-Mail-Adresse angeben").optional().or(z.literal('')),
  message: z.string().min(5, "Nachricht muss mindestens 5 Zeichen lang sein").max(1000, "Nachricht darf maximal 1000 Zeichen lang sein"),
});

export default function Guestbook() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gästebucheinträge abrufen
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/guestbook"],
    queryFn: async () => {
      const response = await fetch("/api/guestbook");
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Gästebucheinträge");
      }
      return response.json();
    }
  });

  // Mutation für das Hinzufügen neuer Einträge
  const createEntryMutation = useMutation({
    mutationFn: async (data: { name: string; email?: string; message: string }) => {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ein Fehler ist aufgetreten");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Zurücksetzen des Formulars
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
      
      // Cache invalidieren, um die Liste zu aktualisieren
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
      
      toast.toast({
        title: "Danke!",
        description: "Dein Beitrag wurde erfolgreich hinzugefügt.",
      });
    },
    onError: (error: any) => {
      toast.toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validierung
    try {
      const data = { name, email, message };
      guestbookValidationSchema.parse(data);
      
      // Senden der Daten
      createEntryMutation.mutate(data);
    } catch (error: any) {
      // Fehler aus der zod-Validierung extrahieren
      const formattedErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(formattedErrors);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-primary">Kontakt</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Hinterlasse eine Nachricht an das Wahl-O-Mat-Team oder lies, was andere geschrieben haben.
          </p>
        </div>

        {/* Formular zum Hinzufügen neuer Einträge */}
        <Card className="p-6 mb-12 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nachricht senden</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="email">E-Mail (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="message">Nachricht *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deine Nachricht..."
                rows={5}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createEntryMutation.isPending}
            >
              {createEntryMutation.isPending ? "Wird gesendet..." : "Nachricht senden"}
            </Button>
          </form>
        </Card>

        {/* Liste der Gästebucheinträge */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Bisherige Nachrichten</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Einträge werden geladen...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p>Noch keine Nachrichten vorhanden. Sei der Erste, der das Wahl-O-Mat-Team kontaktiert!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry: any) => (
                <Card key={entry.id} className="p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{entry.name}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.createdAt), "d. MMMM yyyy", { locale: de })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {entry.message}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}