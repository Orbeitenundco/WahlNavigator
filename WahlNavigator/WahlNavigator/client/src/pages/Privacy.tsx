import React from "react";

export default function Privacy() {
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Datenschutz</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Anonymität steht im Vordergrund</h2>
            <p className="mb-4">
              Der Wahl-O-Mat ist ausschließlich für deine persönliche, anonyme Selbsterforschung gedacht. Wir haben das Tool bewusst so gestaltet, 
              dass keinerlei persönliche Daten für die Nutzung der Kernfunktion erforderlich sind.
            </p>
            <p className="mb-4">
              <strong className="font-medium">Wichtig:</strong> Bitte gib keine persönlichen Daten ein, die nicht unbedingt erforderlich sind. 
              Insbesondere solltest du in Freitextfeldern wie im Kontaktformular keine sensiblen Informationen wie vollständige Adresse, 
              Geburtsdatum oder andere identifizierende Informationen angeben.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Datenerhebung und -speicherung</h2>
            <p className="mb-4">
              Bei der Nutzung des Wahl-O-Mats:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Werden deine Antworten nur temporär im Browser gespeichert, um deine Ergebnisse zu berechnen.</li>
              <li>Werden keine Cookies verwendet, die dich identifizieren könnten.</li>
              <li>Werden keine personenbezogenen Daten auf unseren Servern gespeichert.</li>
              <li>Werden keine Nutzerprofile erstellt oder Tracking-Technologien eingesetzt.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Kontaktformular</h2>
            <p className="mb-4">
              Wenn du das Kontaktformular nutzt:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Werden dein Name und deine Nachricht gespeichert, um die Kommunikation zu ermöglichen.</li>
              <li>Ist die Angabe deiner E-Mail-Adresse optional und wird nicht für Marketing-Zwecke verwendet.</li>
              <li>Werden deine Daten nicht an Dritte weitergegeben.</li>
            </ul>
            <p className="mt-4">
              Du hast jederzeit das Recht, die Löschung deiner Nachricht zu verlangen, indem du uns kontaktierst.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Teilen von Ergebnissen</h2>
            <p className="mb-4">
              Wenn du deine Ergebnisse über Social Media teilst:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Werden nur die Übereinstimmungsprozente mit den Parteien geteilt, nicht deine individuellen Antworten.</li>
              <li>Gelten die Datenschutzbestimmungen der jeweiligen Plattform, auf der du deine Ergebnisse teilst.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Anonyme Nutzung für Forschungszwecke</h2>
            <p>
              Diese Anwendung dient ausschließlich deiner eigenen politischen Selbsterforschung. Wir möchten betonen, dass dies 
              ein Bildungs- und Informationstool ist, das dir helfen soll, deine politischen Präferenzen besser zu verstehen. 
              Es ist nicht für kommerzielle Zwecke oder zum Sammeln personenbezogener Daten gedacht. Deine politischen Ansichten 
              bleiben deine Privatsache.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}