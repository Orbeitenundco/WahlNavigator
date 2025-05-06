import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "../db";
import * as schema from "../shared/schema";
import { eq, desc, and } from "drizzle-orm";

// Funktion zur Spam-Erkennung
function checkForSpam(message: string, name: string): boolean {
  const combinedText = (message + " " + name).toLowerCase();
  
  // Spam-Indikatoren
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'bitcoin', 'crypto', 
    'investment opportunity', 'free money', 'earn fast',
    'make money online', 'work from home', 'quick cash',
    'pharmacy', 'diet pill', 'weight loss', 'cheap medication',
    'porn', 'xxx', 'sex', 'nude',
    'http://', 'https://', 'www.', '.com', '.net', '.org', '.ru', '.cn'
  ];
  
  // Überprüfe, ob einer der Spam-Indikatoren im Text vorkommt
  return spamKeywords.some(keyword => combinedText.includes(keyword.toLowerCase()));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get topics
  app.get('/api/topics', async (req, res) => {
    try {
      const topics = await storage.getTopics();
      return res.status(200).json(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      return res.status(500).json({ error: 'Failed to fetch topics' });
    }
  });

  // Get parliaments
  app.get('/api/parliaments', async (req, res) => {
    try {
      const parliaments = await storage.getParliaments();
      return res.status(200).json(parliaments);
    } catch (error) {
      console.error('Error fetching parliaments:', error);
      return res.status(500).json({ error: 'Failed to fetch parliaments' });
    }
  });

  // Get parties
  app.get('/api/parties', async (req, res) => {
    try {
      const parties = await storage.getParties();
      return res.status(200).json(parties);
    } catch (error) {
      console.error('Error fetching parties:', error);
      return res.status(500).json({ error: 'Failed to fetch parties' });
    }
  });

  // Get questions (filtered)
  app.get('/api/questions', async (req, res) => {
    try {
      // Get the active filters from storage
      const filters = await storage.getActiveFilters();
      
      // Parse query parameters
      const count = req.query.count ? parseInt(req.query.count as string) : 0;
      const randomize = req.query.randomize === 'true';
      
      const questions = await storage.getQuestions(filters, count, randomize);
      
      // Format questions with party votes
      const formattedQuestions = await Promise.all(
        questions.map(async (question) => {
          const partyVotes = await storage.getPartyVotesForQuestion(question.id);
          return {
            ...question,
            partyVotes
          };
        })
      );
      
      return res.status(200).json(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  // Update filters
  app.post('/api/filters', async (req, res) => {
    try {
      const { timeFilter, levelFilters, topicFilters } = req.body;
      
      // Validate input
      if (!timeFilter || !levelFilters || !topicFilters) {
        return res.status(400).json({ error: 'Missing required filter parameters' });
      }
      
      // Update filters in storage
      await storage.updateFilters({ timeFilter, levelFilters, topicFilters });
      
      return res.status(200).json({ message: 'Filters updated successfully' });
    } catch (error) {
      console.error('Error updating filters:', error);
      return res.status(500).json({ error: 'Failed to update filters' });
    }
  });

  // Calculate results based on user answers
  app.post('/api/calculate-results', async (req, res) => {
    try {
      const { userAnswers } = req.body;
      
      // Validate input
      if (!userAnswers || !Array.isArray(userAnswers)) {
        return res.status(400).json({ error: 'Invalid user answers' });
      }
      
      // Calculate match with parties
      const results = await storage.calculateResults(userAnswers);
      
      return res.status(200).json(results);
    } catch (error) {
      console.error('Error calculating results:', error);
      return res.status(500).json({ error: 'Failed to calculate results' });
    }
  });

  // Mock results endpoint for frontend testing
  app.get('/api/results', async (req, res) => {
    try {
      // In a real implementation, this would check for user answers in session
      // and redirect to home if none found
      
      // Generate sample results for testing
      const mockResults = await storage.getMockResults();
      
      return res.status(200).json(mockResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      return res.status(500).json({ error: 'Failed to fetch results' });
    }
  });
  
  // Admin-Route zum manuellen Auslösen der Fragen-Aktualisierung
  app.post('/api/admin/update-questions', async (req, res) => {
    try {
      // In einer echten Implementierung würde hier eine Authentifizierung stattfinden
      const { autoUpdateQuestions } = await import('../db/auto-update-questions');
      
      // Aktualisierung starten
      console.log('Manuelle Fragen-Aktualisierung gestartet...');
      const success = await autoUpdateQuestions();
      
      if (success) {
        return res.status(200).json({ message: 'Fragen erfolgreich aktualisiert' });
      } else {
        return res.status(500).json({ error: 'Fehler bei der Aktualisierung der Fragen' });
      }
    } catch (error) {
      console.error('Fehler bei der manuellen Aktualisierung:', error);
      return res.status(500).json({ error: 'Interner Serverfehler bei der Aktualisierung' });
    }
  });
  
  // Gästebuch-Routen
  
  // Gästebucheinträge abrufen (nur genehmigte, keine Spam-Einträge)
  app.get('/api/guestbook', async (req, res) => {
    try {
      // Einträge abrufen
      const entries = await db.select()
        .from(schema.guestbook)
        .where(and(
          eq(schema.guestbook.isSpam, false),
          eq(schema.guestbook.approved, true)
        ))
        .orderBy(desc(schema.guestbook.createdAt))
        .limit(100); // Begrenzen wir auf 100 Einträge
      
      return res.status(200).json(entries);
    } catch (error) {
      console.error('Error fetching guestbook entries:', error);
      return res.status(500).json({ error: 'Failed to fetch guestbook entries' });
    }
  });
  
  // Gästebucheintrag erstellen
  app.post('/api/guestbook', async (req, res) => {
    try {
      // Validieren der Eingabedaten
      const { name, email, message } = req.body;
      
      if (!name || !message) {
        return res.status(400).json({ error: 'Name und Nachricht sind erforderlich' });
      }
      
      // Einfache Spam-Filterung
      const isSpam = checkForSpam(message, name);
      
      // Auto-Genehmigung für Nicht-Spam-Beiträge
      // In einer realen Anwendung würde man hier vielleicht eine Moderationsphase einbauen
      const approved = !isSpam;
      
      // Eintrag speichern
      const [entry] = await db.insert(schema.guestbook)
        .values({
          name,
          email: email || null,
          message,
          isSpam,
          approved
        })
        .returning();
      
      return res.status(201).json({ 
        success: true,
        message: isSpam ? 
          'Dein Beitrag wird von einem Moderator überprüft.' : 
          'Dein Beitrag wurde erfolgreich hinzugefügt.',
        entry
      });
    } catch (error) {
      console.error('Error creating guestbook entry:', error);
      return res.status(500).json({ error: 'Failed to create guestbook entry' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
