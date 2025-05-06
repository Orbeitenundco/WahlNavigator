import { db } from "./index";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if topics exist
    const existingTopics = await db.query.topics.findMany();
    if (existingTopics.length === 0) {
      console.log("Seeding topics...");
      await db.insert(schema.topics).values([
        { name: "Umwelt & Klima", slug: "umwelt-klima", description: "Umweltschutz, Klimawandel, Energiepolitik" },
        { name: "Wirtschaft", slug: "wirtschaft", description: "Wirtschaftspolitik, Steuern, Arbeitsmarkt" },
        { name: "Sicherheit", slug: "sicherheit", description: "Innere Sicherheit, Verteidigung, Datenschutz" },
        { name: "Soziales", slug: "soziales", description: "Soziale Gerechtigkeit, Rente, Gesundheit" },
        { name: "Bildung", slug: "bildung", description: "Bildungspolitik, Forschung, Digitalisierung" },
        { name: "Migration", slug: "migration", description: "Einwanderungspolitik, Integration, Asyl" },
      ]);
    }

    // Check if parliaments exist
    const existingParliaments = await db.query.parliaments.findMany();
    if (existingParliaments.length === 0) {
      console.log("Seeding parliaments...");
      await db.insert(schema.parliaments).values([
        { name: "Deutscher Bundestag", shortName: "Bundestag", isFederal: true, region: null },
        { name: "Bayerischer Landtag", shortName: "Bayern", isFederal: false, region: "Bayern" },
        { name: "Berliner Abgeordnetenhaus", shortName: "Berlin", isFederal: false, region: "Berlin" },
        { name: "Landtag Nordrhein-Westfalen", shortName: "NRW", isFederal: false, region: "Nordrhein-Westfalen" },
        { name: "Hamburgische Bürgerschaft", shortName: "Hamburg", isFederal: false, region: "Hamburg" },
      ]);
    }

    // Check if parties exist
    const existingParties = await db.query.parties.findMany();
    if (existingParties.length === 0) {
      console.log("Seeding parties...");
      await db.insert(schema.parties).values([
        { name: "Bündnis 90/Die Grünen", shortName: "Grüne", color: "#46962b", logo: "gruene.svg" },
        { name: "Sozialdemokratische Partei Deutschlands", shortName: "SPD", color: "#e3000f", logo: "spd.svg" },
        { name: "Christlich Demokratische Union", shortName: "CDU", color: "#000000", logo: "cdu.svg" },
        { name: "Christlich-Soziale Union", shortName: "CSU", color: "#0570c9", logo: "csu.svg" },
        { name: "Freie Demokratische Partei", shortName: "FDP", color: "#ffed00", logo: "fdp.svg" },
        { name: "Die Linke", shortName: "Linke", color: "#be3075", logo: "linke.svg" },
        { name: "Alternative für Deutschland", shortName: "AfD", color: "#009ee0", logo: "afd.svg" },
        { name: "Bündnis Sahra Wagenknecht", shortName: "BSW", color: "#960048", logo: "bsw.svg" },
        { name: "Freie Wähler", shortName: "FW", color: "#ffa500", logo: "fw.svg" },
        { name: "Bündnis Deutschland", shortName: "BD", color: "#1e3791", logo: "bd.svg" },
      ]);
    }
    
    // Wenn neue Parteien hinzugefügt werden sollen und bereits Parteien existieren
    else if (existingParties.length > 0 && existingParties.length < 10) {
      console.log("Ergänze fehlende Parteien...");
      
      // Erstelle ein Set der vorhandenen Kurznamen
      const existingShortNames = new Set(existingParties.map(p => p.shortName));
      
      // Definiere alle Parteien 
      const allParties = [
        { name: "Bündnis 90/Die Grünen", shortName: "Grüne", color: "#46962b", logo: "gruene.svg" },
        { name: "Sozialdemokratische Partei Deutschlands", shortName: "SPD", color: "#e3000f", logo: "spd.svg" },
        { name: "Christlich Demokratische Union", shortName: "CDU", color: "#000000", logo: "cdu.svg" },
        { name: "Christlich-Soziale Union", shortName: "CSU", color: "#0570c9", logo: "csu.svg" },
        { name: "Freie Demokratische Partei", shortName: "FDP", color: "#ffed00", logo: "fdp.svg" },
        { name: "Die Linke", shortName: "Linke", color: "#be3075", logo: "linke.svg" },
        { name: "Alternative für Deutschland", shortName: "AfD", color: "#009ee0", logo: "afd.svg" },
        { name: "Bündnis Sahra Wagenknecht", shortName: "BSW", color: "#960048", logo: "bsw.svg" },
        { name: "Freie Wähler", shortName: "FW", color: "#ffa500", logo: "fw.svg" },
        { name: "Bündnis Deutschland", shortName: "BD", color: "#1e3791", logo: "bd.svg" },
      ];
      
      // Füge nur die fehlenden Parteien hinzu
      const missingParties = allParties.filter(party => !existingShortNames.has(party.shortName));
      
      if (missingParties.length > 0) {
        await db.insert(schema.parties).values(missingParties);
        console.log(`${missingParties.length} neue Parteien hinzugefügt.`);
      }
    }

    // Get topic and parliament IDs for reference
    const topics = await db.query.topics.findMany();
    const parliaments = await db.query.parliaments.findMany();
    const parties = await db.query.parties.findMany();

    // Mapping for easier reference
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

    // Check if questions exist
    const existingQuestions = await db.query.questions.findMany();
    if (existingQuestions.length === 0) {
      console.log("Seeding questions...");
      
      const questionsToInsert = [
        {
          title: "CO₂-Preis für fossile Brennstoffe",
          description: "Der Bundestag stimmte über ein Gesetz zur Einführung eines CO₂-Preises für fossile Brennstoffe ab, um Klimaziele zu erreichen.",
          topicId: topicMap["Umwelt & Klima"],
          parliamentId: parliamentMap["Bundestag"],
          isFederal: true,
          date: new Date("2019-11-15"),
          year: 2019,
          agreeText: "Ich unterstütze die Einführung eines CO₂-Preises",
          disagreeText: "Ich lehne einen CO₂-Preis ab",
          detailedInfo: "<p>Am 15. November 2019 stimmte der Deutsche Bundestag über das Brennstoffemissionshandelsgesetz (BEHG) ab, das einen CO₂-Preis für Benzin, Diesel, Heizöl und Erdgas festlegt.</p><p>Der Startpreis wurde auf 25€ pro Tonne CO₂ festgelegt, mit einer schrittweisen Erhöhung in den folgenden Jahren.</p><p>Die Grünen kritisierten den Preis als zu niedrig, während FDP, Linke und AfD das Gesetz aus unterschiedlichen Gründen ablehnten.</p>",
          sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2019/kw46-de-brennstoffemissionshandel-667300",
          sourceDescription: "Deutscher Bundestag, Drucksache 19/14746",
        },
        {
          title: "Vorratsdatenspeicherung",
          description: "Der Bundestag stimmte über die Neuregelung der Speicherung von Kommunikationsdaten ab.",
          topicId: topicMap["Sicherheit"],
          parliamentId: parliamentMap["Bundestag"],
          isFederal: true,
          date: new Date("2021-03-26"),
          year: 2021,
          agreeText: "Ich unterstütze die Vorratsdatenspeicherung",
          disagreeText: "Ich lehne die Vorratsdatenspeicherung ab",
          detailedInfo: "<p>Am 26. März 2021 stimmte der Deutsche Bundestag über einen Gesetzentwurf zur Neuregelung der Vorratsdatenspeicherung ab.</p><p>Der Gesetzentwurf sieht vor, dass Telekommunikationsanbieter Verbindungsdaten für 10 Wochen und Standortdaten für 4 Wochen speichern müssen.</p><p>CDU/CSU und SPD stimmten dafür, während Grüne, FDP und Linke dagegen stimmten. Die AfD enthielt sich mehrheitlich.</p>",
          sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2021/kw12-de-vorratsdatenspeicherung-832866",
          sourceDescription: "Deutscher Bundestag, Drucksache 19/27900",
        },
        {
          title: "Lieferkettengesetz",
          description: "Der Bundestag stimmte über ein Gesetz zur Einhaltung von Menschenrechten in globalen Lieferketten ab.",
          topicId: topicMap["Wirtschaft"],
          parliamentId: parliamentMap["Bundestag"],
          isFederal: true,
          date: new Date("2021-06-11"),
          year: 2021,
          agreeText: "Ich unterstütze das Lieferkettengesetz",
          disagreeText: "Ich lehne das Lieferkettengesetz ab",
          detailedInfo: "<p>Am 11. Juni 2021 stimmte der Deutsche Bundestag über das Lieferkettensorgfaltspflichtengesetz ab.</p><p>Das Gesetz verpflichtet große Unternehmen, Menschenrechte und Umweltstandards in ihren Lieferketten zu beachten.</p><p>CDU/CSU und SPD stimmten dafür, während AfD und FDP dagegen stimmten. Grüne und Linke enthielten sich, da ihnen das Gesetz nicht weit genug ging.</p>",
          sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2021/kw23-de-lieferkettengesetz-846840",
          sourceDescription: "Deutscher Bundestag, Drucksache 19/30505",
        },
        {
          title: "Mindestlohnerhöhung",
          description: "Der Bundestag stimmte über eine Erhöhung des gesetzlichen Mindestlohns auf 12 Euro pro Stunde ab.",
          topicId: topicMap["Soziales"],
          parliamentId: parliamentMap["Bundestag"],
          isFederal: true,
          date: new Date("2022-06-03"),
          year: 2022,
          agreeText: "Ich unterstütze die Erhöhung des Mindestlohns",
          disagreeText: "Ich lehne die Erhöhung des Mindestlohns ab",
          detailedInfo: "<p>Am 3. Juni 2022 stimmte der Deutsche Bundestag über das Gesetz zur Erhöhung des Schutzes durch den gesetzlichen Mindestlohn ab.</p><p>Das Gesetz sieht eine Erhöhung des Mindestlohns auf 12 Euro pro Stunde zum 1. Oktober 2022 vor.</p><p>SPD, Grüne und Linke stimmten dafür, CDU/CSU, AfD und FDP dagegen.</p>",
          sourceUrl: "https://www.bundestag.de/dokumente/textarchiv/2022/kw22-de-mindestlohn-895778",
          sourceDescription: "Deutscher Bundestag, Drucksache 20/1408",
        },
      ];

      // Insert questions
      for (const questionData of questionsToInsert) {
        const [question] = await db.insert(schema.questions).values(questionData).returning();
        
        // Generate votes based on question
        if (question.id === 1) {
          // CO2 price votes
          await db.insert(schema.votes).values([
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: "Aber Preis zu niedrig" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Bevorzugt marktwirtschaftliche Lösung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Sozial ungerecht" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Lehnt Klimaschutzmaßnahmen ab" },
          ]);
        } else if (question.id === 2) {
          // Vorratsdatenspeicherung votes
          await db.insert(schema.votes).values([
            { questionId: question.id, partyId: partyMap["Grüne"], position: "disagree", details: "Datenschutzbedenken" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: "Sicherheitsargumente" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Freiheitsrechte" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "disagree", details: "Bürgerrechte" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "neutral", details: "Gespalten" },
          ]);
        } else if (question.id === 3) {
          // Lieferkettengesetz votes
          await db.insert(schema.votes).values([
            { questionId: question.id, partyId: partyMap["Grüne"], position: "neutral", details: "Zu schwach" },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Bürokratieaufwand" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "neutral", details: "Nicht weitreichend genug" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: "Wirtschaftsbelastung" },
          ]);
        } else if (question.id === 4) {
          // Mindestlohn votes
          await db.insert(schema.votes).values([
            { questionId: question.id, partyId: partyMap["Grüne"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["SPD"], position: "agree", details: null },
            { questionId: question.id, partyId: partyMap["CDU/CSU"], position: "disagree", details: "Tarifautonomie" },
            { questionId: question.id, partyId: partyMap["FDP"], position: "disagree", details: "Gegen politische Festlegung" },
            { questionId: question.id, partyId: partyMap["Linke"], position: "agree", details: "Fordert 13 Euro" },
            { questionId: question.id, partyId: partyMap["AfD"], position: "disagree", details: null },
          ]);
        }
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
