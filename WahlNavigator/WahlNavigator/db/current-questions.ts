import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Diese Funktion fügt aktuelle politische Fragen hinzu
export async function addCurrentQuestions() {
  try {
    console.log("Füge aktuelle politische Fragen hinzu...");

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

    // Aktuelle Fragen (2024/2025)
    const currentQuestions = [
      {
        title: "Asylreform der EU",
        description: "Reform des gemeinsamen europäischen Asylsystems mit strengeren Asylverfahren an den EU-Außengrenzen und Verteilung der Flüchtlinge",
        topicId: topicMap["Migration"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-04-25"),
        year: 2024,
        agreeText: "Ich unterstütze die EU-Asylreform mit strengeren Grenzverfahren",
        disagreeText: "Ich lehne die Reform des EU-Asylsystems ab",
        detailedInfo: "<p>Der Bundestag beriet über die Reform des Gemeinsamen Europäischen Asylsystems (GEAS).</p><p>Die Reform sieht vor, dass Asylbewerber bereits an den EU-Außengrenzen in Schnellverfahren geprüft werden und bei geringer Bleibeperspektive direkt abgewiesen werden können.</p><p>SPD, Grüne, CDU/CSU unterstützen die Reform größtenteils, während Die Linke und Teile der Grünen sie als zu hart kritisieren. Die AfD findet die Maßnahmen nicht weitgehend genug.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/kw17-de-regierungserklaerung-eu-985714",
        sourceDescription: "Deutscher Bundestag, Plenarprotokoll 20/166"
      },
      {
        title: "Cannabis-Legalisierung",
        description: "Gesetz zur Legalisierung von Cannabis für den privaten Konsum und kontrollierte Abgabe",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-02-23"),
        year: 2024,
        agreeText: "Ich unterstütze die Legalisierung von Cannabis",
        disagreeText: "Ich lehne die Legalisierung von Cannabis ab",
        detailedInfo: "<p>Am 23. Februar 2024 verabschiedete der Bundestag das Gesetz zur Legalisierung von Cannabis.</p><p>Das Gesetz erlaubt den Besitz von bis zu 25 Gramm Cannabis für den Eigenkonsum und den Anbau von drei Pflanzen pro Person ab 18 Jahren.</p><p>Die Ampel-Koalition stimmte dafür, CDU/CSU und AfD dagegen. Kritiker befürchten Gesundheitsrisiken besonders für junge Menschen, Befürworter betonen die Entlastung der Justiz und besseren Jugendschutz durch regulierten Markt.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/kw08-de-cannabis-979758",
        sourceDescription: "Deutscher Bundestag, Drucksache 20/10992"
      },
      {
        title: "Schuldenbremse reformieren",
        description: "Reform der im Grundgesetz verankerten Schuldenbremse, um mehr Investitionen in Infrastruktur und Klimaschutz zu ermöglichen",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-01-18"),
        year: 2024,
        agreeText: "Ich befürworte eine Reform der Schuldenbremse",
        disagreeText: "Ich möchte an der aktuellen Schuldenbremse festhalten",
        detailedInfo: "<p>Der Bundestag debattierte am 18. Januar 2024 über eine mögliche Reform der Schuldenbremse.</p><p>Die Schuldenbremse begrenzt die Nettokreditaufnahme des Bundes auf 0,35 Prozent des BIP.</p><p>SPD und Grüne befürworten eine Reform, um mehr Investitionen zu ermöglichen. Die FDP, CDU/CSU und AfD lehnen eine Aufweichung ab. Die Linke fordert eine komplette Abschaffung.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/kw03-de-aktuellestunde-schuldenbremse-977980",
        sourceDescription: "Deutscher Bundestag, Plenarprotokoll 20/121"
      },
      {
        title: "Lieferung von Taurus-Marschflugkörpern an die Ukraine",
        description: "Debatte über die Lieferung weitreichender Taurus-Marschflugkörper zur Unterstützung der Ukraine im Krieg gegen Russland",
        topicId: topicMap["Sicherheit"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2024-03-13"),
        year: 2024,
        agreeText: "Ich unterstütze die Lieferung von Taurus-Marschflugkörpern an die Ukraine",
        disagreeText: "Ich lehne die Lieferung von Taurus-Marschflugkörpern an die Ukraine ab",
        detailedInfo: "<p>Der Bundestag debattierte über einen Antrag der CDU/CSU zur Lieferung von Taurus-Marschflugkörpern an die Ukraine.</p><p>Taurus-Marschflugkörper haben eine Reichweite von über 500 km und können auch Ziele tief in Russland treffen.</p><p>CDU/CSU und Teile von FDP und Grünen befürworten die Lieferung. Bundeskanzler Scholz (SPD) lehnt die Lieferung ab, weil dies eine direkte Beteiligung Deutschlands am Krieg bedeuten könnte. Die AfD und Die Linke sprechen sich gegen weitere Waffenlieferungen aus.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2024/kw11-de-ukraine-taurus-982172",
        sourceDescription: "Deutscher Bundestag, Drucksache 20/9801"
      },
      {
        title: "Förderung von Wärmepumpen",
        description: "Förderprogramm für den Einbau klimafreundlicher Heizungen wie Wärmepumpen im Rahmen des Gebäudeenergiegesetzes",
        topicId: topicMap["Umwelt & Klima"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-09-08"),
        year: 2023,
        agreeText: "Ich unterstütze die staatliche Förderung von Wärmepumpen",
        disagreeText: "Ich lehne die staatliche Förderung von Wärmepumpen ab",
        detailedInfo: "<p>Der Bundestag beschloss ein Förderprogramm für den Einbau klimafreundlicher Heizungen wie Wärmepumpen.</p><p>Das Programm sieht eine Grundförderung von 30 Prozent der Kosten vor, mit zusätzlichen Boni für einkommensschwache Haushalte.</p><p>Die Ampel-Koalition stimmte dafür, CDU/CSU kritisierte die Regelung als zu bürokratisch und teuer, die AfD lehnte das Gesetz komplett ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/kw36-de-gebaeude-energiegesetz-964144",
        sourceDescription: "Deutscher Bundestag, Drucksache 20/8653"
      },
      {
        title: "Verkürzung der Gymnasialzeit (G8/G9)",
        description: "Diskussion über die Rückkehr zu neun Jahren Gymnasium (G9) in Bundesländern mit achtjährigem Gymnasium (G8)",
        topicId: topicMap["Bildung"],
        parliamentId: parliamentMap["Bayern"],
        isFederal: false,
        date: new Date("2023-11-15"),
        year: 2023,
        agreeText: "Ich unterstütze die Rückkehr zu G9 (neun Jahre Gymnasium)",
        disagreeText: "Ich befürworte G8 (acht Jahre Gymnasium)",
        detailedInfo: "<p>Der Bayerische Landtag debattierte über die Weiterentwicklung des neunjährigen Gymnasiums.</p><p>Bayern hat 2018 nach Protesten das neunjährige Gymnasium wieder eingeführt.</p><p>CSU und Freie Wähler unterstützen G9, Teile der FDP und der Wirtschaftsverbände bevorzugen G8. SPD und Grüne fordern flexiblere Modelle mit individuellen Wahlmöglichkeiten.</p>",
        sourceUrl: "https://www.bayern.landtag.de/aktuelles/sitzungen/aus-dem-plenum/gymnasium-weiterentwicklung-foerderung-pm-42-2023/",
        sourceDescription: "Bayerischer Landtag, Plenarprotokoll 18/42"
      },
      {
        title: "Mietpreisbremse und Mietendeckel",
        description: "Maßnahmen zur Begrenzung des Mietanstiegs in Ballungsgebieten mit angespanntem Wohnungsmarkt",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Berlin"],
        isFederal: false,
        date: new Date("2023-12-07"),
        year: 2023,
        agreeText: "Ich befürworte strenge Mietpreisregulierungen wie den Mietendeckel",
        disagreeText: "Ich lehne starke Eingriffe in den Mietmarkt ab",
        detailedInfo: "<p>Das Berliner Abgeordnetenhaus debattierte über neue Maßnahmen zur Mietpreisbegrenzung.</p><p>Nach dem Scheitern des Berliner Mietendeckels vor dem Bundesverfassungsgericht wurden alternative Regulierungen diskutiert.</p><p>SPD, Grüne und Linke befürworten strenge Mietpreisregulierungen, CDU und FDP setzen auf mehr Wohnungsbau statt Markteingriffe.</p>",
        sourceUrl: "https://www.parlament-berlin.de/de/Plenum/Plenarberichte",
        sourceDescription: "Berliner Abgeordnetenhaus, Plenarprotokoll 19/52"
      },
      {
        title: "Tempolimit auf Autobahnen",
        description: "Einführung eines generellen Tempolimits von 130 km/h auf deutschen Autobahnen",
        topicId: topicMap["Umwelt & Klima"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-10-05"),
        year: 2023,
        agreeText: "Ich unterstütze ein generelles Tempolimit auf Autobahnen",
        disagreeText: "Ich lehne ein generelles Tempolimit auf Autobahnen ab",
        detailedInfo: "<p>Der Bundestag debattierte erneut über die Einführung eines allgemeinen Tempolimits auf deutschen Autobahnen.</p><p>Deutschland ist das einzige Land in Europa ohne generelles Tempolimit. Befürworter verweisen auf CO2-Einsparung und erhöhte Verkehrssicherheit, Gegner auf die persönliche Freiheit.</p><p>SPD und Grüne sind überwiegend für ein Tempolimit, FDP, CDU/CSU und AfD dagegen. Die Linke befürwortet ein Tempolimit von 120 km/h.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/kw40-tempolimit-autobahnen",
        sourceDescription: "Deutscher Bundestag, Ausschussprotokoll Verkehr, 20/33"
      },
      {
        title: "Einführung einer Vermögenssteuer",
        description: "Wiedereinführung einer Steuer auf hohe Vermögen zur Finanzierung öffentlicher Aufgaben",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-11-10"),
        year: 2023,
        agreeText: "Ich unterstütze die Einführung einer Vermögenssteuer für sehr wohlhabende Personen",
        disagreeText: "Ich lehne eine Vermögenssteuer ab",
        detailedInfo: "<p>Der Bundestag diskutierte die mögliche Wiedereinführung einer Vermögenssteuer.</p><p>Die Vermögenssteuer wurde in Deutschland 1997 ausgesetzt, nachdem das Bundesverfassungsgericht die damalige Ausgestaltung für verfassungswidrig erklärt hatte.</p><p>SPD, Grüne und Linke befürworten eine Vermögenssteuer für sehr hohe Vermögen. CDU/CSU, FDP und AfD lehnen sie wegen möglicher negativer Auswirkungen auf Investitionen und den Mittelstand ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/steuerpolitik-vermoegensteuer",
        sourceDescription: "Wissenschaftlicher Dienst des Bundestags, WD 4-3000-100/23"
      },
      {
        title: "Reform des öffentlich-rechtlichen Rundfunks",
        description: "Umfassende Reform von ARD, ZDF und Deutschlandradio und Anpassung des Rundfunkbeitrags",
        topicId: topicMap["Medien"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-07-12"),
        year: 2023,
        agreeText: "Ich bin für eine Reform und Verkleinerung des öffentlich-rechtlichen Rundfunks",
        disagreeText: "Ich unterstütze den öffentlich-rechtlichen Rundfunk in seiner jetzigen Form",
        detailedInfo: "<p>Der Kulturausschuss des Bundestags führte eine Anhörung zur Reform des öffentlich-rechtlichen Rundfunks durch.</p><p>Nach Skandalen um Misswirtschaft bei einigen ARD-Anstalten werden Umfang des Angebots, Höhe des Rundfunkbeitrags und die Kontrollmechanismen diskutiert.</p><p>Die Positionen reichen von grundlegender Reform mit deutlicher Verkleinerung (CDU/CSU, FDP, teilweise AfD) bis hin zur Verteidigung des bestehenden Systems mit Anpassungen (SPD, Grüne).</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/kw29-pa-kultur-medien-oeffentlich-rechtlicher-rundfunk-954140",
        sourceDescription: "Deutscher Bundestag, Ausschussprotokoll Kultur und Medien, 20/45"
      },
      {
        title: "Abschaffung des Solidaritätszuschlags",
        description: "Vollständige Abschaffung des Solidaritätszuschlags für alle Steuerzahler",
        topicId: topicMap["Wirtschaft"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2022-09-14"),
        year: 2022,
        agreeText: "Ich bin für die vollständige Abschaffung des Solidaritätszuschlags",
        disagreeText: "Der Solidaritätszuschlag sollte für hohe Einkommen bestehen bleiben",
        detailedInfo: "<p>Der Bundestag debattierte über einen Gesetzentwurf zur vollständigen Abschaffung des Solidaritätszuschlags.</p><p>Seit 2021 zahlen rund 90% der Steuerzahler keinen Solidaritätszuschlag mehr. Für die oberen 10% der Einkommensbezieher gilt er weiterhin.</p><p>FDP, CDU/CSU und AfD fordern die vollständige Abschaffung, teils mit Verweis auf verfassungsrechtliche Bedenken. SPD, Grüne und Linke wollen den Soli für Besserverdienende beibehalten.</p>",
        sourceUrl: "https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Schlaglichter/Solidaritaetszuschlag/Fact-Sheet-Soli.html",
        sourceDescription: "Deutscher Bundestag, Drucksache 20/1013"
      },
      {
        title: "Rentenalter und Renteneintrittszeit",
        description: "Diskussion über eine weitere Anhebung des gesetzlichen Renteneintrittsalters auf 68 oder 70 Jahre",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2023-09-01"),
        year: 2023,
        agreeText: "Ich unterstütze eine weitere Anhebung des Renteneintrittsalters",
        disagreeText: "Ich lehne eine weitere Anhebung des Renteneintrittsalters ab",
        detailedInfo: "<p>Der Bundestag debattierte über die Zukunft des Rentensystems und mögliche weitere Anhebungen des Renteneintrittsalters.</p><p>Derzeit wird das Renteneintrittsalter schrittweise auf 67 Jahre angehoben (bis 2031). Stimmen aus der Wirtschaft und einzelnen Parteien fordern eine weitere Anhebung auf 68, 69 oder 70 Jahre.</p><p>CDU/CSU tendieren zu einer weiteren Anhebung, FDP ist teilweise dafür. SPD, Grüne, Linke und AfD lehnen eine weitere Anhebung des Renteneintrittsalters ab.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2023/rentenpolitik-debatte",
        sourceDescription: "Deutscher Bundestag, Drucksache 20/5350"
      }
    ];

    // Füge Fragen und Parteipositionen hinzu
    for (const questionData of currentQuestions) {
      // Prüfe, ob die Frage bereits existiert
      const existingQuestion = await db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.title, questionData.title));

      if (existingQuestion.length === 0) {
        // Füge Frage hinzu
        const [question] = await db.insert(schema.questions).values([questionData]).returning();
        
        // Definiere Parteipositionen basierend auf der Frage
        let partyVotes: any[] = [];
        
        // Asylreform EU
        if (question.title === "Asylreform der EU") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Mehrheitlich Zustimmung, aber mit starken Bedenken" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt die Reform" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "Unterstützt die Reform, fordert aber strengere Maßnahmen" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Unterstützt die Reform" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Lehnt die Reform als unmenschlich ab" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Lehnt die Reform als nicht weitgehend genug ab" }
          ];
        }
        // Cannabis-Legalisierung
        else if (question.title === "Cannabis-Legalisierung") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Legalisierung und Regulierung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für kontrollierte Legalisierung" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Gegen Legalisierung, warnt vor Gesundheitsrisiken" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für Legalisierung aus Gründen der Freiheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Legalisierung und Entkriminalisierung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Legalisierung" }
          ];
        }
        // Schuldenbremse
        else if (question.title === "Schuldenbremse reformieren") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Reform, um Investitionen zu ermöglichen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Reform der Schuldenbremse" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Gegen Reform, für Beibehaltung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Strikte Ablehnung einer Reform" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für komplette Abschaffung der Schuldenbremse" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Reform, für Beibehaltung" }
          ];
        }
        // Taurus-Lieferung
        else if (question.title === "Lieferung von Taurus-Marschflugkörpern an die Ukraine") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Teile der Fraktion dafür, Teile dagegen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Mehrheitlich gegen Lieferung" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "Für Lieferung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Teile der Fraktion dafür, Teile folgen Koalitionsdisziplin" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Waffenlieferungen generell" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Waffenlieferungen" }
          ];
        }
        // Wärmepumpen
        else if (question.title === "Förderung von Wärmepumpen") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Starke Unterstützung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützung mit sozialen Ausgleichen" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "neutral", details: "Kritik an Umsetzung, nicht am Grundsatz" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Unterstützung mit Betonung auf Technologieoffenheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Unterstützung mit Forderung nach mehr sozialer Absicherung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Ablehnung des gesamten Heizungsgesetzes" }
          ];
        }
        // G8/G9
        else if (question.title === "Verkürzung der Gymnasialzeit (G8/G9)") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Für flexible Modelle" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Tendenz zu G9, aber mit Flexibilität" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "In Bayern für G9" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Tendenz zu G8 mit Wahlmöglichkeit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für G9 wegen weniger Leistungsdruck" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für traditionelles G9-Modell" }
          ];
        }
        // Mietpreisbremse
        else if (question.title === "Mietpreisbremse und Mietendeckel") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für strikte Mietpreisregulierung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Mietpreisbremse und weitere Regulierungen" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Gegen zu starke Markteingriffe" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen Markteingriffe, für mehr Neubau" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für starke Mietpreisregulierung bis Mietendeckel" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Position variiert je nach Region" }
          ];
        }
        // Tempolimit
        else if (question.title === "Tempolimit auf Autobahnen") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Tempolimit aus Klima- und Sicherheitsgründen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Mehrheitlich für Tempolimit" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Gegen allgemeines Tempolimit" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen Tempolimit, betont Bürgerfreiheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Tempolimit 120 km/h" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Strikt gegen Tempolimit" }
          ];
        }
        // Vermögenssteuer
        else if (question.title === "Einführung einer Vermögenssteuer") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Vermögenssteuer ab hohen Vermögen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Vermögenssteuer für sehr wohlhabende Personen" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Gegen Vermögenssteuer, Sorge um Wirtschaftsstandort" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Strikt gegen Vermögenssteuer" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für progressive Vermögenssteuer" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Vermögenssteuer" }
          ];
        }
        // ÖRR Reform
        else if (question.title === "Reform des öffentlich-rechtlichen Rundfunks") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Für Reform mit Beibehaltung des Kernauftrags" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "neutral", details: "Für moderate Reformen" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "Für deutliche Reformierung und Verschlankung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für umfassende Reform und geringere Beiträge" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "neutral", details: "Für Reform mit stärkerer demokratischer Kontrolle" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für radikale Verkleinerung bis hin zur Abschaffung" }
          ];
        }
        // Soli
        else if (question.title === "Abschaffung des Solidaritätszuschlags") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Für Beibehaltung bei hohen Einkommen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Für Beibehaltung bei hohen Einkommen" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "Für vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für sofortige und vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Für Beibehaltung bei hohen Einkommen" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für vollständige Abschaffung" }
          ];
        }
        // Rente
        else if (question.title === "Rentenalter und Renteneintrittszeit") {
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Gegen weitere Anhebung des Renteneintrittsalters" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Gegen weitere Anhebung, für Stabilisierung bei 67" },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "neutral", details: "Tendenziell für Erhöhung, aber differenziert nach Berufsgruppen" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Für flexibles Rentenalter statt starrer Grenze" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Strikt gegen Anhebung, für Renteneintritt ab 65" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen weitere Anhebung des Renteneintrittsalters" }
          ];
        }
        
        // Füge die Parteipositionen in die Datenbank ein
        if (partyVotes.length > 0) {
          await db.insert(schema.votes).values(partyVotes);
        }
      }
    }

    console.log("Aktuelle Fragen erfolgreich hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen aktueller Fragen:", error);
  }
}

// Führe die Funktion aus
addCurrentQuestions().finally(() => {
  console.log("Script beendet");
});