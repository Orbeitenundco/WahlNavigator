import React from "react";
import { Link } from "wouter";

export default function LearnMore() {
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Mehr erfahren</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Wie funktioniert der Wahl-O-Mat?</h2>
            <p className="mb-4">
              Der Wahl-O-Mat ist ein interaktives Tool, das dir hilft, deine politischen Positionen mit den tatsächlichen Abstimmungsverhalten 
              der deutschen Parteien zu vergleichen. Im Gegensatz zu ähnlichen Tools, die auf Wahlprogrammen basieren, verwendet der Wahl-O-Mat 
              reale Abstimmungsdaten aus dem Bundestag und den Landtagen der letzten 10 Jahre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Schritt-für-Schritt-Anleitung</h2>
            <ol className="list-decimal ml-6 space-y-6">
              <li>
                <h3 className="font-medium text-lg text-primary">Quiz starten</h3>
                <p className="mt-2">
                  Auf der Startseite klickst du auf "Quiz starten". Du erhältst eine Reihe von Fragen, die auf tatsächlichen parlamentarischen 
                  Abstimmungen basieren. Die Fragen werden zufällig aus unserer Datenbank ausgewählt und decken verschiedene politische Themenbereiche ab.
                </p>
              </li>

              <li>
                <h3 className="font-medium text-lg text-primary">Fragen beantworten</h3>
                <p className="mt-2">
                  Bei jeder Frage hast du drei Antwortmöglichkeiten:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Stimme zu</strong> - Du unterstützt die vorgeschlagene Position.</li>
                  <li><strong>Neutral</strong> - Du hast keine starke Meinung oder bist unentschlossen.</li>
                  <li><strong>Stimme nicht zu</strong> - Du lehnst die vorgeschlagene Position ab.</li>
                </ul>
                <p className="mt-2">
                  Zusätzlich gibst du an, wie wichtig dir das Thema ist:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Niedrig</strong> - Das Thema ist für dich weniger wichtig.</li>
                  <li><strong>Mittel</strong> - Das Thema hat eine mittlere Bedeutung für dich.</li>
                  <li><strong>Hoch</strong> - Das Thema ist dir besonders wichtig.</li>
                </ul>
                <p className="mt-2">
                  Du kannst Fragen auch überspringen, wenn du keine Meinung dazu hast oder nicht antworten möchtest.
                </p>
              </li>

              <li>
                <h3 className="font-medium text-lg text-primary">Ergebnisauswertung</h3>
                <p className="mt-2">
                  Nach Beantwortung aller Fragen berechnet der Wahl-O-Mat deine Übereinstimmung mit den verschiedenen Parteien. 
                  Das Ergebnis zeigt:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Gesamtübereinstimmung</strong> - Der prozentuale Grad der Übereinstimmung mit jeder Partei.</li>
                  <li><strong>Thematische Übereinstimmung</strong> - Wie sehr du in bestimmten Politikbereichen mit den Parteien übereinstimmst.</li>
                  <li><strong>Schlüsselthemen</strong> - Die wichtigsten Themen, bei denen du mit den Top-Parteien übereinstimmst oder von ihnen abweichst.</li>
                  <li><strong>Detailanalyse</strong> - Eine detaillierte Aufschlüsselung deiner Antworten im Vergleich zu den Positionen der Parteien.</li>
                </ul>
              </li>

              <li>
                <h3 className="font-medium text-lg text-primary">Ergebnisse teilen</h3>
                <p className="mt-2">
                  Du kannst deine Ergebnisse auf Social-Media-Plattformen teilen, um Diskussionen anzuregen oder andere zu ermutigen, 
                  den Wahl-O-Mat ebenfalls zu nutzen. Dabei werden nur die Prozentangaben der Übereinstimmung geteilt, nicht deine individuellen Antworten.
                </p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Politische Bildung und Engagement</h2>
            <p className="mb-4">
              Der Wahl-O-Mat ist mehr als nur ein Werkzeug zum Vergleich deiner Meinungen mit Parteipositionen. Er soll:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Das Verständnis für politische Entscheidungsprozesse fördern</li>
              <li>Komplexe politische Themen zugänglicher machen</li>
              <li>Zum kritischen Denken und zur Auseinandersetzung mit verschiedenen Standpunkten anregen</li>
              <li>Die politische Beteiligung und das Interesse an demokratischen Prozessen stärken</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Weitere Ressourcen</h2>
            <p className="mb-4">
              Um dich noch umfassender zu informieren, empfehlen wir:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Die Websites der Parteien zu besuchen, um deren aktuelle Programme und Positionen zu verstehen</li>
              <li>Die Plenarprotokolle des Bundestags und der Landtage zu lesen</li>
              <li>Lokale politische Veranstaltungen zu besuchen und mit Politikern direkt ins Gespräch zu kommen</li>
              <li>Qualitätsjournalismus zu konsumieren, der verschiedene politische Perspektiven abdeckt</li>
            </ul>
          </section>

          <div className="mt-10 text-center">
            <Link href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}