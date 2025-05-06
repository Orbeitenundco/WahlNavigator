import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Diese Funktion aktualisiert die Parteistimmen für vorhandene Fragen und fügt neue Parteien hinzu
async function updatePartyVotes() {
  try {
    console.log("Aktualisiere Parteistimmen...");

    // Hole alle notwendigen Referenzen
    const parties = await db.query.parties.findMany();
    const questions = await db.query.questions.findMany();

    // Mapping für einfacheren Zugriff auf Partei-IDs
    const partyMap = parties.reduce((acc, party) => {
      acc[party.shortName] = party.id;
      return acc;
    }, {} as Record<string, number>);

    console.log("Gefundene Parteien:", Object.keys(partyMap).join(", "));
    console.log("Anzahl der Fragen:", questions.length);

    // Aktualisiere die Stimmen für alle Fragen
    for (const question of questions) {
      // Lösche vorhandene Stimmen für diese Frage
      await db.delete(schema.votes).where(eq(schema.votes.questionId, question.id));
      console.log(`Stimmen für Frage "${question.title}" gelöscht`);

      // Definiere neue Parteistimmen je nach Frage
      let partyVotes: any[] = [];

      // Stimmen basierend auf Fragentitel definieren
      switch (question.title) {
        case "Asylreform der EU":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Mehrheitlich Zustimmung, aber mit starken Bedenken" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Unterstützt die Reform" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Unterstützt die Reform, fordert aber strengere Maßnahmen" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Unterstützt die Reform, fordert aber strengere Maßnahmen" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Unterstützt die Reform" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Lehnt die Reform als unmenschlich ab" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Lehnt die Reform als nicht weitgehend genug ab" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Kritisiert die Reform als nicht ausreichend" },
            { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "Unterstützt die Reform" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Befürwortet strengere Asylverfahren" }
          ];
          break;

        case "Cannabis-Legalisierung":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Legalisierung und Regulierung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für kontrollierte Legalisierung" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Legalisierung, warnt vor Gesundheitsrisiken" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt gegen jede Form der Legalisierung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für Legalisierung aus Gründen der Freiheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Legalisierung und Entkriminalisierung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Legalisierung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Keine eindeutige Position" },
            { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Gegen Legalisierung" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Legalisierung von Cannabis" }
          ];
          break;

        case "Schuldenbremse reformieren":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Reform, um Investitionen zu ermöglichen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Reform der Schuldenbremse" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Reform, für Beibehaltung" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikte Ablehnung einer Reform" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Strikte Ablehnung einer Reform" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für komplette Abschaffung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Reform" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Befürwortet Reform für Investitionen" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Differenzierte Position" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Für Beibehaltung der Schuldenbremse" }
          ];
          break;

        case "Lieferung von Taurus-Marschflugkörpern an die Ukraine":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Intern gespalten, Tendenz zur Lieferung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Kanzler Scholz gegen Lieferung" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Für Lieferung" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Für Lieferung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Intern gespalten, viele für Lieferung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Waffenlieferungen" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Waffenlieferungen" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Strikt gegen Waffenlieferungen" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Differenzierte Position" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für Unterstützung der Ukraine" }
          ];
          break;

        case "Förderung von Wärmepumpen":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Stark für Förderung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Förderung" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "neutral", details: "Kritik an Umsetzung, nicht am Grundsatz" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "neutral", details: "Kritik an Umsetzung, nicht am Grundsatz" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Für Technologieoffenheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Förderung mit sozialer Komponente" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Gebäudeenergiegesetz" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Kritisch gegenüber aktueller Umsetzung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für Technologieoffenheit" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen staatliche Förderung" }
          ];
          break;

        case "Verkürzung der Gymnasialzeit (G8/G9)":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Für flexible Modelle" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "neutral", details: "Für Wahlmöglichkeit" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "In vielen Ländern für G9" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "In Bayern für G9" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Tendenz zu G8" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Eher für G9" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für G9" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Tendenz zu G9" },
            { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "In Bayern für G9" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für Rückkehr zu G9" }
          ];
          break;

        case "Mietpreisbremse und Mietendeckel":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Mietregulierung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Starker Befürworter von Mietpreisbremsen" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen zu starke Markteingriffe" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Gegen Mietendeckel" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen Markteingriffe, für mehr Bau" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für starke Regulierung und Deckelung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Differenzierte Position je nach Region" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Für starke Mietpreisregulierung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für moderate Regulierung" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen starke staatliche Eingriffe" }
          ];
          break;

        case "Tempolimit auf Autobahnen":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Tempolimit 130 km/h" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Mehrheitlich für Tempolimit" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen allgemeines Tempolimit" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt gegen Tempolimit" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen Tempolimit, für Freiheit" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für Tempolimit 120 km/h" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Tempolimit" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Keine klare Position" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Keine einheitliche Position" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Tempolimit" }
          ];
          break;

        case "Einführung einer Vermögenssteuer":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für Vermögenssteuer bei hohen Vermögen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für Vermögenssteuer" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Gegen Vermögenssteuer, Sorge um Wirtschaftsstandort" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt gegen neue Steuern" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen neue Steuern und Belastungen" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Starker Befürworter einer Vermögenssteuer" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen neue Steuern" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Für Besteuerung sehr hoher Vermögen" },
            { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Eher gegen Vermögenssteuer" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen neue Steuerbelastungen" }
          ];
          break;

        case "Reform des öffentlich-rechtlichen Rundfunks":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Für moderate Reformen, gegen starke Kürzungen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Gegen grundlegende Reform, für Anpassungen" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Für deutliche Reformierung und Verschlankung" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Für starke Reduzierung und Fokussierung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Für grundlegende Reform und Beitragssenkung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "neutral", details: "Für Reform mit stärkerer Mitbestimmung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für komplette Neuausrichtung/Abschaffung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Kritisiert aktuelle Berichterstattung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "Für Reform und Beitragssenkung" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für umfassende Reform" }
          ];
          break;

        case "Abschaffung des Solidaritätszuschlags":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Gegen vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Gegen vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Für vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Für vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "agree", details: "Starker Befürworter der vollständigen Abschaffung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Abschaffung für Besserverdienende" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "agree", details: "Für Abschaffung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Gegen vollständige Abschaffung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "agree", details: "Für Abschaffung" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Für Abschaffung aller Sondersteuern" }
          ];
          break;

        case "Rentenalter und Renteneintrittszeit":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Gegen weitere pauschale Anhebung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "disagree", details: "Gegen Anhebung über 67 Jahre" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "neutral", details: "Tendenziell für Erhöhung, aber differenziert nach Berufsgruppen" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "neutral", details: "Für flexiblere Modelle" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "neutral", details: "Für flexible, individuelle Lösungen" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Gegen Anhebung, für Absenkung auf 65" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen weitere Anhebung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Gegen Erhöhung des Renteneintrittsalters" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für flexibles Renteneintrittsalter" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen weitere Erhöhung" }
          ];
          break;

        case "CO₂-Preis für fossile Brennstoffe":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Aber Preis zu niedrig" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Mit Bedenken bezüglich sozialer Auswirkungen" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Bevorzugt marktwirtschaftliche Lösung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Sozial ungerecht" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Lehnt Klimaschutzmaßnahmen ab" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Kritisiert soziale Auswirkungen" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für moderaten CO₂-Preis mit sozialen Ausgleichsmaßnahmen" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen zusätzliche Belastungen" }
          ];
          break;

        case "Vorratsdatenspeicherung":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Datenschutzbedenken" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: "Sicherheitsargumente" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Stark für Vorratsdatenspeicherung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Freiheitsrechte" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Bürgerrechte" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Gespalten" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "disagree", details: "Kritisch gegenüber anlassloser Speicherung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Position differenziert nach Anlässen" },
            { questionId: question.id, partyId: partyMap["BD"], position: "agree", details: "Befürwortet erweiterte Speicherung für Sicherheitszwecke" }
          ];
          break;

        case "Lieferkettengesetz":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Zu schwach" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CSU"], position: "agree", details: "Mit Bedenken wegen Bürokratie" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Bürokratieaufwand" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "neutral", details: "Nicht weitreichend genug" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Wirtschaftsbelastung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "neutral", details: "Grundsätzlich für Menschenrechtsstandards, kritisiert Umsetzung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "disagree", details: "Kritisiert Bürokratie und Belastung für Mittelstand" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Lehnt zusätzliche Bürokratie ab" }
          ];
          break;

        case "Mindestlohnerhöhung":
          partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Tarifautonomie" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Tarifautonomie" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen politische Festlegung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Fordert 13 Euro" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: null },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Fordert deutlich höheren Mindestlohn" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Position differenziert nach Regionen" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Für Tarifautonomie" }
          ];
          break;

        default:
          console.log(`Keine spezifischen Parteistimmen für Frage "${question.title}" definiert`);
          continue;
      }

      // Füge die neuen Parteistimmen hinzu
      if (partyVotes.length > 0) {
        await db.insert(schema.votes).values(partyVotes);
        console.log(`${partyVotes.length} Parteistimmen für Frage "${question.title}" hinzugefügt`);
      }
    }

    console.log("Parteistimmen erfolgreich aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Parteistimmen:", error);
  }
}

updatePartyVotes();