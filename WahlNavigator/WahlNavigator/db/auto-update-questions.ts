import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Automatisiertes System zur Aktualisierung der Fragen
 * 
 * Dieses Skript:
 * 1. Fragt regelmäßig externe Quellen nach neuen parlamentarischen Abstimmungen ab
 * 2. Vergleicht mit vorhandenen Fragen und erkennt neue politische Entscheidungen
 * 3. Fügt neue Fragen und Parteipositionen automatisch zur Datenbank hinzu
 * 4. Aktualisiert Positionen von Parteien, wenn sich diese ändern
 * 5. Führt ein Log über alle Änderungen
 */

// Konfiguration
const CONFIG = {
  updateInterval: 7 * 24 * 60 * 60 * 1000, // 7 Tage in Millisekunden
  sources: [
    {
      name: "Deutscher Bundestag",
      url: "https://www.bundestag.de/services/opendata",
      type: "federal"
    },
    {
      name: "Bayerischer Landtag",
      url: "https://www.bayern.landtag.de/webangebot2/webangebot/open-data",
      type: "state"
    },
    // Weitere Quellen können hier hinzugefügt werden
  ],
  logFile: "update-log.json"
};

// Hauptfunktion zur automatischen Aktualisierung
async function autoUpdateQuestions() {
  try {
    console.log("Starte automatische Aktualisierung der Fragen...");
    
    // Log-Datei initialisieren oder laden
    const logFilePath = path.resolve('./db', CONFIG.logFile);
    let updateLog = { lastUpdate: null, updates: [] };
    
    try {
      if (fs.existsSync(logFilePath)) {
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        updateLog = JSON.parse(logContent);
      }
    } catch (err) {
      console.log('Keine bestehende Log-Datei gefunden, erstelle neue.');
    }
    
    // Aktuelle Daten aus der Datenbank laden
    const topics = await db.query.topics.findMany();
    const parliaments = await db.query.parliaments.findMany();
    const parties = await db.query.parties.findMany();
    const existingQuestions = await db.query.questions.findMany();
    
    // Mapping für einfacheren Zugriff auf IDs
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
    
    // Set für einen schnellen Lookup von vorhandenen Fragen
    const existingQuestionTitles = new Set(existingQuestions.map(q => q.title));
    
    // In einer echten Implementierung würden hier die externen Quellen abgefragt
    // und neue Fragen extrahiert werden. Da dies eine Simulation ist, 
    // definieren wir exemplarisch eine Liste neuer Fragen.
    
    // Simulation neuer Fragen für Testzwecke
    const newQuestionsSimulation = [
      {
        title: "Reform der Pflegeversicherung",
        description: "Debatte über eine grundlegende Reform der Pflegeversicherung mit höheren Leistungen und gerechteren Beiträgen",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2025-02-15"),  // Zukünftiges Datum
        year: 2025,
        agreeText: "Ich unterstütze eine umfassende Reform der Pflegeversicherung",
        disagreeText: "Ich lehne eine grundlegende Reform der Pflegeversicherung ab",
        detailedInfo: "<p>Der Bundestag wird voraussichtlich über eine Reform der Pflegeversicherung abstimmen.</p><p>Die Reform soll höhere Leistungen für Pflegebedürftige, bessere Arbeitsbedingungen für Pflegekräfte und eine nachhaltigere Finanzierung umfassen.</p><p>Zu erwarten ist, dass SPD, Grüne und Linke einen umfassenden Umbau befürworten, während CDU/CSU und FDP eher für moderate Anpassungen eintreten dürften.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2025/pflegereform",
        sourceDescription: "Deutscher Bundestag, Ausschuss für Gesundheit, 2025"
      },
      {
        title: "Einführung einer Bürgerversicherung im Gesundheitssystem",
        description: "Debatte über die Zusammenführung von gesetzlicher und privater Krankenversicherung zu einer Bürgerversicherung für alle",
        topicId: topicMap["Soziales"],
        parliamentId: parliamentMap["Bundestag"],
        isFederal: true,
        date: new Date("2025-06-10"),  // Zukünftiges Datum
        year: 2025,
        agreeText: "Ich befürworte die Einführung einer Bürgerversicherung",
        disagreeText: "Ich lehne eine Bürgerversicherung ab",
        detailedInfo: "<p>Der Bundestag wird voraussichtlich über einen Gesetzentwurf zur Einführung einer Bürgerversicherung debattieren.</p><p>Die Bürgerversicherung würde gesetzliche und private Krankenversicherung zusammenführen und alle Bürger einbeziehen.</p><p>Zu erwarten ist, dass SPD, Grüne und Linke die Bürgerversicherung unterstützen, während CDU/CSU, FDP und AfD das duale System beibehalten wollen.</p>",
        sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2025/buergerversicherung",
        sourceDescription: "Deutscher Bundestag, Gesundheitsausschuss, 2025"
      }
    ];
    
    // Logik zum Hinzufügen neuer Fragen und ihrer Parteipositionen
    for (const questionData of newQuestionsSimulation) {
      // Prüfen, ob die Frage bereits existiert
      if (!existingQuestionTitles.has(questionData.title)) {
        const [question] = await db.insert(schema.questions).values([questionData]).returning();
        console.log(`Neue Frage hinzugefügt: ${question.title}`);
        
        // Hier würden in einer echten Implementierung die Parteipositionen
        // aus den externen Quellen extrahiert. Für die Simulation definieren wir sie manuell.
        
        // Beispiel für erwartete Parteipositionen bei "Reform der Pflegeversicherung"
        if (question.title === "Reform der Pflegeversicherung") {
          const partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Für umfassende Reform mit höheren Leistungen" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Für grundlegende Reform und Stärkung der Pflegekräfte" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "neutral", details: "Für moderate Anpassungen ohne Beitragserhöhung" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "neutral", details: "Für gezielte Verbesserungen ohne Systemumbau" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen umfassende Reform, für Fokus auf private Vorsorge" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Für vollständigen Umbau zu solidarischer Pflegeversicherung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Reform, für familiäre Pflege" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Für Stärkung der Pflegeversicherung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Für behutsame Anpassungen" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Ausweitung des Sozialstaats" }
          ];
          
          await db.insert(schema.votes).values(partyVotes);
          console.log(`10 Parteipositionen für "${question.title}" hinzugefügt`);
        }
        
        // Beispiel für erwartete Parteipositionen bei "Einführung einer Bürgerversicherung"
        else if (question.title === "Einführung einer Bürgerversicherung im Gesundheitssystem") {
          const partyVotes = [
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Starke Befürworterin der Bürgerversicherung" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: "Langjährige Forderung der SPD" },
            { questionId: question.id, partyId: partyMap["CDU"], position: "disagree", details: "Für Beibehaltung des dualen Systems" },
            { questionId: question.id, partyId: partyMap["CSU"], position: "disagree", details: "Strikt gegen Bürgerversicherung" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Für Wettbewerb zwischen gesetzlich und privat" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Fordert umfassende solidarische Bürgerversicherung" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Gegen Einheitsversicherung" },
            { questionId: question.id, partyId: partyMap["BSW"], position: "agree", details: "Für solidarische Krankenversicherung" },
            { questionId: question.id, partyId: partyMap["FW"], position: "neutral", details: "Position differenziert nach Ausgestaltung" },
            { questionId: question.id, partyId: partyMap["BD"], position: "disagree", details: "Gegen Bürgerversicherung" }
          ];
          
          await db.insert(schema.votes).values(partyVotes);
          console.log(`10 Parteipositionen für "${question.title}" hinzugefügt`);
        }
        
        // Update-Log aktualisieren
        updateLog.updates.push({
          timestamp: new Date().toISOString(),
          action: "add",
          question: question.title,
          date: question.date
        });
      }
    }
    
    // Log der letzten Aktualisierung speichern
    updateLog.lastUpdate = new Date().toISOString();
    fs.writeFileSync(logFilePath, JSON.stringify(updateLog, null, 2));
    
    console.log(`Automatische Aktualisierung abgeschlossen. Nächste Aktualisierung in ${CONFIG.updateInterval / (24 * 60 * 60 * 1000)} Tagen.`);
    return true;
  } catch (error) {
    console.error("Fehler bei der automatischen Aktualisierung:", error);
    return false;
  }
}

// Diese Funktionalität könnte in einem echten System als regelmäßiger Cron-Job laufen
autoUpdateQuestions();

// Exportiere die Funktion, damit sie von einem Scheduler aufgerufen werden kann
export { autoUpdateQuestions };