import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Diese Funktion fügt weitere politische Fragen hinzu
export async function addMoreQuestions() {
  try {
    console.log("Füge weitere politische Fragen hinzu...");

    // Hole die ID-Referenzen
    const topics = await db.query.topics.findMany();
    const parliaments = await db.query.parliaments.findMany();
    const parties = await db.query.parties.findMany();

    // Mapping für einfacheren Zugriff
    const topicMap = topics.reduce((acc, topic) => {
      acc[topic.name] = topic.id;
      return acc;
    }, {} as Record<string, number>);

    const parliamentMap = parliaments.reduce((acc, parliament) => {
      acc[parliament.shortName] = parliament.id;
      return acc;
    }, {} as Record<string, number>);

    const partyMap = parties.reduce((acc, party) => {
      acc[party.shortName] = party.id;
      return acc;
    }, {} as Record<string, number>);

    console.log("Gefundene Parteien:", Object.keys(partyMap).join(", "));

    // Weitere aktuelle Fragen
    const additionalQuestions = [
      {
        title: "Erhöhung des Verteidigungsetats auf 2% des BIP",
        description: "Debatte über die dauerhafte Erhöhung der Verteidigungsausgaben auf 2% des Bruttoinlandsprodukts im Rahmen der NATO-Verpflichtungen",
        topicId: topicMap["Sicherheit"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-02-10"),
        year: 2024,
        agreeText: "Ich unterstütze die Erhöhung der Verteidigungsausgaben auf 2% des BIP",
        disagreeText: "Ich lehne die Erhöhung der Verteidigungsausgaben auf 2% des BIP ab",
        detailedInfo: "<p>Der Bundestag debattierte über die dauerhafte Erhöhung der Verteidigungsausgaben auf 2% des BIP.</p><p>Seit dem russischen Angriff auf die Ukraine hat Deutschland sein Engagement für die Verteidigung verstärkt und strebt an, das NATO-Ziel von 2% des BIP für Verteidigungsausgaben zu erreichen.</p><p>CDU/CSU, FDP und SPD unterstützen die Erhöhung. Die Grünen sind gespalten, Linke und teilweise BSW lehnen die Erhöhung ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/verteidigungshaushalt",
        sourceDescription: "Deutscher Bundestag, Haushaltsberatungen 2024"
      },
      {
        title: "Verkürzung der Schulferien",
        description: "Vorschlag zur Verkürzung der Sommerferien bei gleichzeitiger Verteilung der freien Tage über das Schuljahr",
        topicId: topicMap["Bildung"],
        parliamentId: parliamentMap["NRW"],
        isFederal: false,
        date: new Date("2024-01-15"),
        year: 2024,
        agreeText: "Ich unterstütze eine Verkürzung der Sommerferien",
        disagreeText: "Ich lehne eine Verkürzung der Sommerferien ab",
        detailedInfo: "<p>Der Landtag NRW diskutierte über eine mögliche Reform des Ferienkalenders mit kürzeren Sommerferien.</p><p>Befürworter argumentieren, dass kürzere Sommerferien und dafür mehr Pausen während des Schuljahres das Lernen effektiver machen könnten.</p><p>Lehrerverbände und Teile der Tourismusindustrie lehnen die Verkürzung ab.</p>",
        sourceUrl: "https://www.landtag.nrw.de/portal/WWW/dokumentenarchiv/schulausschuss-2024",
        sourceDescription: "Landtag Nordrhein-Westfalen, Ausschussprotokoll Schule und Bildung, 2024"
      },
      {
        title: "Bargeldobergrenze auf 10.000 Euro",
        description: "Einführung einer EU-weiten Obergrenze für Bargeldtransaktionen von 10.000 Euro zur Bekämpfung von Geldwäsche",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-12-12"),
        year: 2023,
        agreeText: "Ich unterstütze eine Bargeldobergrenze von 10.000 Euro",
        disagreeText: "Ich lehne eine Bargeldobergrenze ab",
        detailedInfo: "<p>Der Bundestag debattierte über den EU-Vorschlag zur Einführung einer Bargeldobergrenze von 10.000 Euro.</p><p>Die EU-Kommission hat im Rahmen eines Pakets zur Bekämpfung von Geldwäsche und Terrorismusfinanzierung eine EU-weite Obergrenze vorgeschlagen.</p><p>SPD und Grüne unterstützen den Vorschlag, FDP, CDU/CSU und AfD lehnen ihn als Eingriff in die Freiheit und das Recht auf Bargeld ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/geldwaesche-bargeldobergrenze",
        sourceDescription: "Deutscher Bundestag, Finanzausschuss, Protokoll 20/49"
      },
      {
        title: "Erhöhung der Grunderwerbsteuer",
        description: "Erhöhung der Grunderwerbsteuer beim Immobilienkauf zur Finanzierung des Landeshaushalts",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["NRW"],
        isFederal: false,
        date: new Date("2023-10-20"),
        year: 2023,
        agreeText: "Ich befürworte eine Erhöhung der Grunderwerbsteuer",
        disagreeText: "Ich lehne eine Erhöhung der Grunderwerbsteuer ab",
        detailedInfo: "<p>Der Landtag NRW diskutierte über eine mögliche Erhöhung der Grunderwerbsteuer von 6,5% auf 7%.</p><p>Die Grunderwerbsteuer wird beim Kauf von Immobilien fällig und ist eine wichtige Einnahmequelle für die Bundesländer.</p><p>CDU, FDP und AfD lehnen eine Erhöhung ab, SPD und Grüne signalisieren Unterstützung für eine moderate Erhöhung.</p>",
        sourceUrl: "https://www.landtag.nrw.de/portal/WWW/dokumentenarchiv/finanzpolitik-2023",
        sourceDescription: "Landtag NRW, Haushaltsberatungen 2023/2024"
      },
      {
        title: "Einführung der 4-Tage-Woche",
        description: "Debatte über Modellversuche zur 4-Tage-Woche bei gleichem Lohn zur Verbesserung der Work-Life-Balance",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-03-20"),
        year: 2024,
        agreeText: "Ich unterstütze die Einführung einer 4-Tage-Woche",
        disagreeText: "Ich lehne die 4-Tage-Woche ab",
        detailedInfo: "<p>Der Bundestag debattierte über Modelle zur Flexibilisierung der Arbeitszeit, darunter die 4-Tage-Woche.</p><p>Die Idee: Bei gleichem Lohn nur vier statt fünf Tage arbeiten, um Produktivität zu steigern und die Work-Life-Balance zu verbessern.</p><p>Linke, Teile der SPD und Grünen unterstützen Modellprojekte. CDU/CSU, FDP und AfD sehen die Wettbewerbsfähigkeit gefährdet.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/arbeitszeitmodelle-viertage-woche",
        sourceDescription: "Deutscher Bundestag, Ausschuss für Arbeit und Soziales, 2024"
      },
      {
        title: "Senkung des Wahlalters auf 16 Jahre",
        description: "Gesetzentwurf zur Senkung des Wahlalters bei Bundestagswahlen von 18 auf 16 Jahre",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-11-30"),
        year: 2023,
        agreeText: "Ich unterstütze die Senkung des Wahlalters auf 16 Jahre",
        disagreeText: "Ich lehne die Senkung des Wahlalters auf 16 Jahre ab",
        detailedInfo: "<p>Der Bundestag debattierte über eine Absenkung des Wahlalters für Bundestagswahlen auf 16 Jahre.</p><p>Bei Europawahlen und in einigen Bundesländern bei Landtagswahlen können Jugendliche bereits ab 16 Jahren wählen.</p><p>SPD, Grüne, FDP und Linke unterstützen die Absenkung, CDU/CSU und AfD lehnen sie ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/wahlalter-absenkung",
        sourceDescription: "Deutscher Bundestag, Innenausschuss, Protokoll 20/93"
      },
      {
        title: "Gentechnik in der Landwirtschaft",
        description: "Debatte über den Einsatz neuer gentechnischer Verfahren (Genome Editing) in der Landwirtschaft",
        topicId: topicMap["Umwelt & Klima"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-09-28"),
        year: 2023,
        agreeText: "Ich befürworte den Einsatz neuer Gentechnik in der Landwirtschaft",
        disagreeText: "Ich lehne den Einsatz neuer Gentechnik in der Landwirtschaft ab",
        detailedInfo: "<p>Der Bundestag debattierte über neue EU-Regeln für gentechnisch veränderte Pflanzen.</p><p>Die EU-Kommission hat vorgeschlagen, die Regeln für bestimmte gentechnisch veränderte Pflanzen zu lockern, wenn diese auch durch konventionelle Züchtung hätten entstehen können.</p><p>FDP, Teile der CDU/CSU und SPD befürworten die Lockerung, Grüne und Linke sind skeptisch bis ablehnend.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/gentechnik-landwirtschaft",
        sourceDescription: "Deutscher Bundestag, Ausschuss für Ernährung und Landwirtschaft, 2023"
      },
      {
        title: "Verbot von Einweg-Plastik",
        description: "Umsetzung der EU-Richtlinie zum Verbot bestimmter Einweg-Plastikprodukte wie Strohhalme, Besteck und Teller",
        topicId: topicMap["Umwelt & Klima"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-06-15"),
        year: 2023,
        agreeText: "Ich unterstütze das Verbot von Einweg-Plastik",
        disagreeText: "Ich lehne das Verbot von Einweg-Plastik ab",
        detailedInfo: "<p>Der Bundestag beschloss die Umsetzung der EU-Richtlinie zum Verbot bestimmter Einweg-Plastikprodukte.</p><p>Die Richtlinie verbietet Produkte wie Plastikbesteck, -teller, Strohhalme und Wattestäbchen aus Kunststoff.</p><p>SPD, Grüne, Teile der CDU/CSU und Linke unterstützten das Verbot, die FDP war gespalten, die AfD lehnte es ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/einwegplastik-verbot",
        sourceDescription: "Deutscher Bundestag, Umweltausschuss, Protokoll 20/45"
      },
      {
        title: "Förderung der Kernfusion",
        description: "Debatte über verstärkte staatliche Investitionen in die Kernfusionsforschung als potenzielle Energiequelle der Zukunft",
        topicId: topicMap["Umwelt & Klima"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-01-25"),
        year: 2024,
        agreeText: "Ich unterstütze verstärkte Investitionen in die Kernfusionsforschung",
        disagreeText: "Ich lehne verstärkte Investitionen in die Kernfusionsforschung ab",
        detailedInfo: "<p>Der Bundestag debattierte über eine Aufstockung der Fördermittel für die Kernfusionsforschung.</p><p>Die Kernfusion gilt als potenziell saubere und nahezu unerschöpfliche Energiequelle der Zukunft, befindet sich aber noch im Forschungsstadium.</p><p>CDU/CSU, FDP und Teile der SPD unterstützen verstärkte Förderung, Grüne und Linke sind skeptisch und bevorzugen Investitionen in erneuerbare Energien.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/kernfusion-forschung",
        sourceDescription: "Deutscher Bundestag, Ausschuss für Bildung und Forschung, 2024"
      },
      {
        title: "Verstaatlichung kritischer Infrastruktur",
        description: "Diskussion über die (Re-)Verstaatlichung von kritischer Infrastruktur wie Energienetzen, Wasserversorgung oder Krankenhäusern",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-10-05"),
        year: 2023,
        agreeText: "Ich befürworte die Verstaatlichung kritischer Infrastruktur",
        disagreeText: "Ich lehne die Verstaatlichung kritischer Infrastruktur ab",
        detailedInfo: "<p>Der Bundestag debattierte über die Rolle des Staates bei kritischer Infrastruktur.</p><p>Anlass waren Diskussionen über die Privatisierung von Krankenhäusern, Wasserversorgung und Energienetzen sowie deren Folgen für die Versorgungssicherheit.</p><p>Linke und Teile der SPD und Grünen befürworten stärkere staatliche Kontrolle, FDP, CDU/CSU und AfD setzen auf privatwirtschaftliche Lösungen mit Regulierung.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/kritische-infrastruktur",
        sourceDescription: "Deutscher Bundestag, Wirtschaftsausschuss, 2023"
      }
    ];

    // Füge Fragen und Parteipositionen hinzu
    for (const questionData of additionalQuestions) {
      // Prüfe, ob die Frage bereits existiert
      const existingQuestion = await db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.title, questionData.title));

      if (existingQuestion.length === 0) {
        // Füge Frage hinzu
        const [question] = await db.insert(schema.questions).values([questionData]).returning();
        console.log(`Neue Frage hinzugefügt: ${question.title}`);
        
        // Definiere Parteipositionen basierend auf der Frage
        let partyVotes: any[] = [];
        
        switch (question.title) {
          case "Erhöhung des Verteidigungsetats auf 2% des BIP":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Intern gespalten, aber grundsätzliche Zustimmung" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt die Erhöhung" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Starker Befürworter" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Fordert sogar mehr als 2%" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Unterstützt die Erhöhung" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Lehnt Aufrüstung ab" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Unterstützt höhere Verteidigungsausgaben" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Gegen Aufrüstung" },
              { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "Unterstützt Einhaltung des NATO-Ziels" },
              { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für höhere Verteidigungsausgaben" }
            ];
            break;
          
          case "Verkürzung der Schulferien":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Offen für Diskussion, keine klare Position" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "neutral", details: "Differenzierte Position" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Verkürzung der Sommerferien" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Gegen Verkürzung" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Tendenz zu kürzeren Sommerferien" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Verkürzung" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Änderung der Ferienzeiten" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Keine klare Position" },
              { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Gegen Verkürzung der Sommerferien" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Für Beibehaltung des aktuellen Ferienkalenders" }
            ];
            break;
          
          case "Bargeldobergrenze auf 10.000 Euro":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Obergrenze zur Geldwäschebekämpfung" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt EU-Vorschlag" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Bargeldlimit" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt gegen Bargeldlimit" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Verteidigt Bargeldfreiheit" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "neutral", details: "Position differenziert nach Ausgestaltung" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Kategorisch gegen Bargeldlimit" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Gegen Einschränkung des Bargelds" },
              { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Gegen Obergrenze" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Bargeldlimit" }
            ];
            break;

          case "Erhöhung der Grunderwerbsteuer":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Unterstützt moderate Erhöhung" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Befürwortet Erhöhung" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Erhöhung" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Gegen Steuererhöhungen" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Strikt gegen Erhöhung" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Erhöhung bei teuren Immobilien" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen höhere Steuern" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Keine klare Position" },
              { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Gegen Erhöhung" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Steuererhöhungen" }
            ];
            break;

          case "Einführung der 4-Tage-Woche":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Offen für Modellversuche" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "neutral", details: "Teile unterstützen Modellprojekte" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Sorge um Wirtschaftlichkeit" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Gegen Arbeitszeitverkürzung" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen staatliche Vorgaben" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Starke Befürworterin der 4-Tage-Woche" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Lehnt ab" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Unterstützt Arbeitszeitverkürzung" },
              { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Skeptisch gegenüber Umsetzbarkeit" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen staatliche Regulierung der Arbeitszeit" }
            ];
            break;

          case "Senkung des Wahlalters auf 16 Jahre":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Starke Befürworterin" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt Wahlalter 16" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Mehrheitlich dagegen" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt dagegen" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für Absenkung des Wahlalters" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Wahlalter 16" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Absenkung" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Keine klare Position" },
              { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Unterschiedliche Positionen je nach Bundesland" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Wahlalter 16" }
            ];
            break;

          case "Gentechnik in der Landwirtschaft":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Mehrheitlich skeptisch bis ablehnend" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "neutral", details: "Differenzierte Position" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Offen für neue Gentechnik" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Befürwortet unter Auflagen" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Stark für Liberalisierung" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Gentechnik in der Landwirtschaft" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Geteilte Meinungen innerhalb der Partei" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Eher ablehnend" },
              { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Differenzierte Position je nach Anwendung" },
              { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für Nutzung neuer Technologien" }
            ];
            break;

          case "Verbot von Einweg-Plastik":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Starke Befürworterin" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt Verbot" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "neutral", details: "Grundsätzlich für Reduktion, aber mit Augenmaß" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "neutral", details: "Für schrittweise Reduktion" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Für Innovation statt Verbote" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Unterstützt Verbot" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Verbote" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Unterstützt Umweltschutzmaßnahmen" },
              { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Mit Einschränkungen" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen pauschale Verbote" }
            ];
            break;

          case "Förderung der Kernfusion":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Skeptisch, aber nicht grundsätzlich ablehnend" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für verstärkte Forschung" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Starker Befürworter" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Für massive Investitionen" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für technologischen Fortschritt" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Skeptisch, bevorzugt erneuerbare Energien" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für Kernenergie, auch Fusion" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Differenzierte Position" },
              { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "Für Forschungsförderung" },
              { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für Kernfusionsforschung" }
            ];
            break;

          case "Verstaatlichung kritischer Infrastruktur":
            partyVotes = [
              { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Für stärkere staatliche Kontrolle in Teilbereichen" },
              { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Tendenziell für mehr staatliche Kontrolle" },
              { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen pauschale Verstaatlichung" },
              { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Gegen Verstaatlichung" },
              { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Für privatwirtschaftliche Lösungen" },
              { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Starke Befürworterin der Verstaatlichung" },
              { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Differenzierte Position je nach Bereich" },
              { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Für Verstaatlichung kritischer Infrastruktur" },
              { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für kommunale Kontrolle wichtiger Bereiche" },
              { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen staatliche Übernahmen" }
            ];
            break;

          default:
            console.log(`Keine Parteipositionen für Frage "${question.title}" definiert`);
            continue;
        }
        
        // Füge Parteipositionen hinzu
        if (partyVotes.length > 0) {
          await db.insert(schema.votes).values(partyVotes);
          console.log(`${partyVotes.length} Parteipositionen für "${question.title}" hinzugefügt`);
        }
      } else {
        console.log(`Frage "${questionData.title}" existiert bereits`);
      }
    }

    console.log("Weitere Fragen erfolgreich hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen weiterer Fragen:", error);
  }
}

addMoreQuestions();