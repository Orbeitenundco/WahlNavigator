import React from "react";

export default function About() {
  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Über uns</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Was ist der Wahl-O-Mat?</h2>
            <p className="mb-4">
              Der Wahl-O-Mat ist ein interaktives Tool, das dir hilft, deine politische Position mit den deutschen Parteien zu vergleichen. 
              Anders als andere Wahl-Entscheidungshilfen basiert unser Wahl-O-Mat auf tatsächlichen Abstimmungsverhalten der Parteien 
              in den deutschen Parlamenten auf Bundes- und Landesebene.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Aufbau des Wahl-O-Mats</h2>
            <p className="mb-4">
              Der Wahl-O-Mat besteht aus drei Hauptkomponenten:
            </p>
            <ol className="list-decimal ml-6 space-y-4">
              <li>
                <strong className="font-medium">Fragesammlung:</strong> Eine umfangreiche Datenbank mit Fragen, die auf tatsächlichen Abstimmungen in deutschen Parlamenten basieren. 
                Diese Abstimmungen werden kontinuierlich aktualisiert und decken verschiedene politische Themen ab.
              </li>
              <li>
                <strong className="font-medium">Matching-Algorithmus:</strong> Ein ausgeklügelter Algorithmus, der deine Antworten mit den tatsächlichen Abstimmungsergebnissen 
                der Parteien vergleicht und ein prozentuales Match berechnet.
              </li>
              <li>
                <strong className="font-medium">Ergebnisanalyse:</strong> Eine detaillierte Auswertung, die nicht nur zeigt, zu welchen Parteien du am besten passt, 
                sondern auch nach Themenbereichen aufschlüsselt, wo Übereinstimmungen und Unterschiede bestehen.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Unser Team</h2>
            <p className="mb-4">
              Der Wahl-O-Mat wurde von einem Team aus Politikwissenschaftlern, Datenanalysten und Softwareentwicklern erstellt, 
              die politische Transparenz und informierte Wahlentscheidungen fördern möchten. Wir sind unabhängig und nicht mit 
              politischen Parteien oder Interessengruppen verbunden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Unser Ziel</h2>
            <p>
              Unser Ziel ist es, Wählern zu helfen, informierte Entscheidungen zu treffen, basierend auf tatsächlichem politischen 
              Verhalten statt auf Wahlversprechen. Wir möchten politische Bildung fördern und die Kluft zwischen Bürgern und Politik 
              überbrücken, indem wir komplexe politische Entscheidungen verständlich und zugänglich machen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}