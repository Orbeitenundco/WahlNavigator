import { db } from "@db";
import { eq, and, or, gte, between, inArray } from "drizzle-orm";
import {
  topics,
  parliaments,
  parties,
  questions,
  votes,
  Topic,
  Party,
  Parliament,
  Question,
  Vote
} from "@shared/schema";

// In-memory filter storage (in production, this would be stored in user session)
let activeFilters = {
  timeFilter: "all",
  levelFilters: {
    federal: true,
    state: true
  },
  topicFilters: {} as Record<string, boolean>
};

export const storage = {
  // Get all topics
  async getTopics() {
    return await db.query.topics.findMany();
  },

  // Get all parliaments
  async getParliaments() {
    return await db.query.parliaments.findMany();
  },

  // Get all parties
  async getParties() {
    return await db.query.parties.findMany();
  },

  // Get questions with active filters
  async getQuestions(filters = activeFilters, count = 0, randomize = false) {
    // Get all topics and parliaments first for mapping
    const allTopics = await this.getTopics();
    const allParliaments = await this.getParliaments();
    
    // Create maps for looking up names by ID
    const topicMap = new Map(allTopics.map(topic => [topic.id, topic.name]));
    const parliamentMap = new Map(allParliaments.map(parliament => [parliament.id, parliament.name]));
    
    let query = db.select().from(questions);
    
    // Apply time filter
    if (filters.timeFilter) {
      const currentYear = new Date().getFullYear();
      
      switch (filters.timeFilter) {
        case '2years':
          query = query.where(gte(questions.year, currentYear - 2));
          break;
        case '5years':
          query = query.where(gte(questions.year, currentYear - 5));
          break;
        case 'all':
        default:
          query = query.where(gte(questions.year, currentYear - 10));
          break;
      }
    }
    
    // Apply parliament level filter
    if (filters.levelFilters) {
      const levelConditions = [];
      
      if (filters.levelFilters.federal) {
        levelConditions.push(eq(questions.isFederal, true));
      }
      
      if (filters.levelFilters.state) {
        levelConditions.push(eq(questions.isFederal, false));
      }
      
      if (levelConditions.length > 0) {
        query = query.where(or(...levelConditions));
      }
    }
    
    // Apply topic filters
    if (filters.topicFilters && Object.keys(filters.topicFilters).length > 0) {
      const selectedTopicIds = Object.entries(filters.topicFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([topicId]) => parseInt(topicId));
      
      if (selectedTopicIds.length > 0) {
        query = query.where(inArray(questions.topicId, selectedTopicIds));
      }
    }
    
    // Execute the query to get raw questions
    let rawQuestions = await query;
    
    // Apply randomization if requested
    if (randomize) {
      // Fisher-Yates Shuffle Algorithm
      for (let i = rawQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawQuestions[i], rawQuestions[j]] = [rawQuestions[j], rawQuestions[i]];
      }
    }
    
    // Limit to specified count if provided
    if (count > 0 && count < rawQuestions.length) {
      rawQuestions = rawQuestions.slice(0, count);
    }
    
    // Add topic and parliament names to each question
    return rawQuestions.map(question => ({
      ...question,
      topic: topicMap.get(question.topicId) || 'Allgemein',
      parliament: parliamentMap.get(question.parliamentId) || 'Unbekannt'
    }));
  },

  // Get party votes for a question
  async getPartyVotesForQuestion(questionId: number) {
    const votesWithParties = await db
      .select({
        partyId: parties.id,
        partyName: parties.name,
        vote: votes.position
      })
      .from(votes)
      .leftJoin(parties, eq(votes.partyId, parties.id))
      .where(eq(votes.questionId, questionId));
    
    return votesWithParties.map(vote => ({
      partyId: vote.partyId,
      partyName: vote.partyName,
      vote: vote.vote
    }));
  },

  // Update filters
  async updateFilters(filters: typeof activeFilters) {
    activeFilters = { ...activeFilters, ...filters };
    return activeFilters;
  },

  // Get active filters
  async getActiveFilters() {
    return activeFilters;
  },

  // Calculate match with parties based on user answers
  async calculateResults(userAnswers: any[]) {
    try {
      // Sammle alle Parteien
      const allParties = await this.getParties();
      
      // Sammle alle Topics für thematische Auswertung
      const allTopics = await this.getTopics();
      
      // Erstelle Analyse-Objekte
      const partyScores: Record<number, { 
        matchScore: number, 
        maxScore: number, 
        totalQuestions: number,
        name: string,
        color: string,
        byTopic: Record<number, { matchScore: number, maxScore: number }>
      }> = {};
      
      // Initialisiere Partei-Scores
      for (const party of allParties) {
        partyScores[party.id] = { 
          matchScore: 0, 
          maxScore: 0, 
          totalQuestions: 0,
          name: party.name,
          color: party.color,
          byTopic: {}
        };
        
        // Initialisiere Topic-Scores für jede Partei
        for (const topic of allTopics) {
          partyScores[party.id].byTopic[topic.id] = { 
            matchScore: 0, 
            maxScore: 0 
          };
        }
      }
      
      // Verarbeite jede Antwort
      for (const userAnswer of userAnswers) {
        // Überspringe Fragen, die übersprungen wurden
        if (userAnswer.answer === 'skip') continue;
        
        // Hole die Frage und die Parteivoten für diese Frage
        const question = await db.query.questions.findFirst({
          where: eq(questions.id, userAnswer.questionId)
        });
        
        if (!question) continue;
        
        const partyVotes = await this.getPartyVotesForQuestion(userAnswer.questionId);
        
        // Gewichtung basierend auf der Wichtigkeit
        let weight = 1;
        if (userAnswer.importance === 'high') weight = 2;
        if (userAnswer.importance === 'low') weight = 0.5;
        
        // Berechne für jede Partei, ob sie mit dem Nutzer übereinstimmt
        for (const vote of partyVotes) {
          const partyId = vote.partyId;
          
          // Erhöhe die Gesamtzahl der Fragen für diese Partei
          partyScores[partyId].totalQuestions++;
          
          // Maximale mögliche Punktzahl für diese Frage
          const maxPoints = weight;
          partyScores[partyId].maxScore += maxPoints;
          
          // Füge die maximale Punktzahl auch zum Topic-Score hinzu
          if (question.topicId) {
            partyScores[partyId].byTopic[question.topicId].maxScore += maxPoints;
          }
          
          // Wenn der Nutzer und die Partei die gleiche Position haben
          if (userAnswer.answer === vote.vote) {
            partyScores[partyId].matchScore += maxPoints;
            
            // Füge die Punkte auch zum Topic-Score hinzu
            if (question.topicId) {
              partyScores[partyId].byTopic[question.topicId].matchScore += maxPoints;
            }
          }
          // Wenn einer neutral ist und der andere eine Position hat, teilweise Übereinstimmung
          else if (userAnswer.answer === 'neutral' || vote.vote === 'neutral') {
            partyScores[partyId].matchScore += maxPoints * 0.5;
            
            // Füge die Punkte auch zum Topic-Score hinzu
            if (question.topicId) {
              partyScores[partyId].byTopic[question.topicId].matchScore += maxPoints * 0.5;
            }
          }
        }
      }
      
      // Berechne Prozentsätze für jede Partei
      const partyMatches = Object.entries(partyScores).map(([partyId, data]) => {
        const matchPercentage = data.maxScore > 0 
          ? Math.round((data.matchScore / data.maxScore) * 100) 
          : 0;
          
        return {
          partyId: parseInt(partyId),
          partyName: data.name,
          partyColor: data.color,
          matchPercentage
        };
      });
      
      // Sortiere nach höchster Übereinstimmung
      partyMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      // Erstelle thematische Ergebnisse
      const thematicResults = allTopics.map(topic => {
        const partyResults = Object.entries(partyScores)
          .map(([partyId, data]) => {
            const topicData = data.byTopic[topic.id];
            const matchPercentage = topicData.maxScore > 0 
              ? Math.round((topicData.matchScore / topicData.maxScore) * 100) 
              : 0;
              
            return {
              partyName: data.name,
              matchPercentage
            };
          })
          .filter(result => result.matchPercentage > 0) // Nur Parteien mit Übereinstimmung
          .sort((a, b) => b.matchPercentage - a.matchPercentage) // Sortieren nach höchster Übereinstimmung
          .slice(0, 3); // Top 3 Parteien pro Thema
          
        return {
          topic: topic.name,
          partyResults
        };
      }).filter(result => result.partyResults.length > 0); // Nur Themen mit Ergebnissen
      
      // Details für die besten Übereinstimmungen
      const topParty = partyMatches[0];
      const topPartyId = topParty?.partyId;
      const keyMatches = [];
      
      if (topPartyId) {
        // Hole die Antworten mit Details
        const userAnswersWithDetails = await this.getUserAnswersWithDetails(userAnswers);
        
        // Finde die stärksten Übereinstimmungen für die Top-Partei
        const strongMatches = userAnswersWithDetails
          .filter(answer => {
            const partyVote = answer.partyVotes.find(v => v.partyId === topPartyId);
            return partyVote && partyVote.vote === answer.userAnswer && answer.userAnswer !== 'neutral';
          })
          .slice(0, 3);
          
        // Erstelle Key Matches aus den starken Übereinstimmungen
        keyMatches.push(...strongMatches.map(match => {
          const position = match.userAnswer === 'agree' ? 'für' : 'gegen';
          return {
            title: match.title,
            description: `Du und ${topParty.partyName} habt beide ${position} "${match.title}" gestimmt.`
          };
        }));
      }
      
      // Hole die Antworten mit Details
      const userAnswersWithDetails = await this.getUserAnswersWithDetails(userAnswers);
      
      return {
        partyMatches,
        thematicResults,
        keyMatches,
        userAnswersWithDetails
      };
    } catch (error) {
      console.error('Fehler bei der Berechnung der Ergebnisse:', error);
      return this.getMockResults();
    }
  },
  
  // Hilfsfunktion, um Antworten mit Details zu erzeugen
  async getUserAnswersWithDetails(userAnswers: any[]) {
    const result = [];
    
    for (const answer of userAnswers) {
      if (answer.answer === 'skip') continue;
      
      const question = await db.query.questions.findFirst({
        where: eq(questions.id, answer.questionId)
      });
      
      if (!question) continue;
      
      // Topic-Name abrufen
      const topic = await db.query.topics.findFirst({
        where: eq(topics.id, question.topicId)
      });
      
      // Parliament-Name abrufen
      const parliament = await db.query.parliaments.findFirst({
        where: eq(parliaments.id, question.parliamentId)
      });
      
      // Parteivoten abrufen
      const votes = await this.getPartyVotesForQuestion(question.id);
      const partyVotes = [];
      
      for (const vote of votes) {
        const party = await db.query.parties.findFirst({
          where: eq(parties.id, vote.partyId)
        });
        
        if (party) {
          partyVotes.push({
            partyId: vote.partyId,
            partyName: vote.partyName,
            partyColor: party.color,
            vote: vote.vote
          });
        }
      }
      
      result.push({
        id: question.id,
        topic: topic?.name || 'Allgemein',
        title: question.title,
        parliament: parliament?.name || 'Unbekannt',
        year: question.year,
        userAnswer: answer.answer,
        importance: answer.importance,
        partyVotes
      });
    }
    
    return result;
  },

  // Generate mock results for testing
  async getMockResults() {
    // This is just for development and would be replaced by actual calculations
    return {
      partyMatches: [
        { partyId: 1, partyName: "Bündnis 90/Die Grünen", partyColor: "green", matchPercentage: 78 },
        { partyId: 2, partyName: "SPD", partyColor: "red", matchPercentage: 63 },
        { partyId: 3, partyName: "CDU/CSU", partyColor: "black", matchPercentage: 58 },
        { partyId: 4, partyName: "FDP", partyColor: "yellow", matchPercentage: 45 },
        { partyId: 5, partyName: "Die Linke", partyColor: "purple", matchPercentage: 42 },
        { partyId: 6, partyName: "AfD", partyColor: "blue", matchPercentage: 23 }
      ],
      thematicResults: [
        {
          topic: "Umwelt & Klima",
          partyResults: [
            { partyName: "Grüne", matchPercentage: 92 },
            { partyName: "SPD", matchPercentage: 75 },
            { partyName: "CDU/CSU", matchPercentage: 42 }
          ]
        },
        {
          topic: "Wirtschaft",
          partyResults: [
            { partyName: "FDP", matchPercentage: 83 },
            { partyName: "CDU/CSU", matchPercentage: 67 },
            { partyName: "SPD", matchPercentage: 58 }
          ]
        }
      ],
      keyMatches: [
        {
          title: "CO₂-Preis für fossile Brennstoffe",
          description: "Du und die Grünen haben für eine stärkere CO₂-Bepreisung gestimmt."
        },
        {
          title: "Erneuerbare-Energien-Gesetz",
          description: "Du und die Grünen haben für einen schnelleren Ausbau erneuerbarer Energien gestimmt."
        },
        {
          title: "Lieferkettengesetz",
          description: "Du und die Grünen haben für strengere Regeln bei Lieferketten gestimmt."
        }
      ],
      userAnswersWithDetails: [
        {
          id: 1,
          topic: "Umwelt & Klima",
          title: "CO₂-Preis für fossile Brennstoffe",
          parliament: "Bundestag",
          year: 2019,
          userAnswer: "agree",
          importance: "high",
          partyVotes: [
            { partyId: 1, partyName: "Grüne", partyColor: "green", vote: "agree" },
            { partyId: 2, partyName: "SPD", partyColor: "red", vote: "agree" },
            { partyId: 3, partyName: "CDU/CSU", partyColor: "black", vote: "agree" },
            { partyId: 4, partyName: "FDP", partyColor: "yellow", vote: "disagree" },
            { partyId: 5, partyName: "Linke", partyColor: "purple", vote: "disagree" },
            { partyId: 6, partyName: "AfD", partyColor: "blue", vote: "disagree" }
          ]
        },
        {
          id: 2,
          topic: "Sicherheit",
          title: "Vorratsdatenspeicherung",
          parliament: "Bundestag",
          year: 2021,
          userAnswer: "disagree",
          importance: "medium",
          partyVotes: [
            { partyId: 1, partyName: "Grüne", partyColor: "green", vote: "disagree" },
            { partyId: 2, partyName: "SPD", partyColor: "red", vote: "agree" },
            { partyId: 3, partyName: "CDU/CSU", partyColor: "black", vote: "agree" },
            { partyId: 4, partyName: "FDP", partyColor: "yellow", vote: "disagree" },
            { partyId: 5, partyName: "Linke", partyColor: "purple", vote: "disagree" },
            { partyId: 6, partyName: "AfD", partyColor: "blue", vote: "neutral" }
          ]
        }
      ]
    };
  }
};
