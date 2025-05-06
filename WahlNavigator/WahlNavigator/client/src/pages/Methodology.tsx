import React from "react";

export default function Methodology() {
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Methodik</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Datenquellen</h2>
            <p className="mb-4">
              Unser Wahl-O-Mat basiert auf tatsächlichen Abstimmungsdaten aus dem Bundestag und den Landtagen der letzten 10 Jahre. 
              Wir sammeln und analysieren Abstimmungsprotokolle und parlamentarische Dokumente, um das reale Abstimmungsverhalten der Parteien zu erfassen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Auswahl der Fragen</h2>
            <p className="mb-4">
              Die Fragen im Wahl-O-Mat werden nach folgenden Kriterien ausgewählt:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Relevanz für aktuelle politische Debatten</li>
              <li>Klare Unterschiede im Abstimmungsverhalten der Parteien</li>
              <li>Ausgewogene Abdeckung verschiedener Politikbereiche</li>
              <li>Verständlichkeit für Bürger ohne spezifische Fachkenntnisse</li>
            </ul>
            <p className="mt-4">
              Die Fragen werden regelmäßig aktualisiert, um neue Abstimmungen und politische Entwicklungen zu berücksichtigen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Berechnungsmethode</h2>
            <p className="mb-4">
              Der Matching-Algorithmus berechnet deine Übereinstimmung mit den Parteien wie folgt:
            </p>
            <ol className="list-decimal ml-6 space-y-4">
              <li>
                <strong className="font-medium">Antworterfassung:</strong> Deine Antworten werden in drei Kategorien erfasst: "Stimme zu", "Neutral" oder "Stimme nicht zu". 
                Zusätzlich kannst du die Wichtigkeit der Frage mit "niedrig", "mittel" oder "hoch" bewerten.
              </li>
              <li>
                <strong className="font-medium">Gewichtung:</strong> Fragen mit hoher Wichtigkeit werden in der Berechnung stärker gewichtet:
                <ul className="list-disc ml-6 mt-2">
                  <li>Niedrig: Faktor 1</li>
                  <li>Mittel: Faktor 2</li>
                  <li>Hoch: Faktor 3</li>
                </ul>
              </li>
              <li>
                <strong className="font-medium">Übereinstimmungsberechnung:</strong> Für jede Frage wird die Übereinstimmung mit den Parteien berechnet:
                <ul className="list-disc ml-6 mt-2">
                  <li>Vollständige Übereinstimmung: 100% × Wichtungsfaktor</li>
                  <li>Neutrale Antwort bei klarer Parteiposition: 50% × Wichtungsfaktor</li>
                  <li>Entgegengesetzte Position: 0% × Wichtungsfaktor</li>
                </ul>
              </li>
              <li>
                <strong className="font-medium">Gesamtergebnis:</strong> Die gewichteten Übereinstimmungswerte werden summiert und durch die maximal mögliche Punktzahl geteilt, 
                um das prozentuale Gesamtergebnis zu erhalten.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Thematische Analyse</h2>
            <p className="mb-4">
              Neben dem Gesamtergebnis analysieren wir deine Übereinstimmung mit den Parteien in verschiedenen Politikbereichen wie Wirtschaft, 
              Umwelt, Soziales, etc. So kannst du sehen, wo deine Positionen am stärksten mit bestimmten Parteien übereinstimmen oder abweichen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Grenzen des Modells</h2>
            <p>
              Wir sind uns bewusst, dass unser Modell Grenzen hat. Abstimmungen im Parlament erfassen nicht alle Nuancen politischer Positionen, 
              und nicht alle Themen werden im Parlament behandelt. Der Wahl-O-Mat kann eine persönliche Auseinandersetzung mit Parteiprogrammen 
              und Kandidaten nicht ersetzen, sondern soll als Orientierungshilfe dienen und zum politischen Diskurs anregen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}