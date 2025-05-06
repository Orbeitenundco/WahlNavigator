import * as cron from 'node-cron';
import { autoUpdateQuestions } from './auto-update-questions';

/**
 * Scheduler für die automatische Aktualisierung der Fragen
 * 
 * Dieser Scheduler verwendet node-cron, um die automatische Aktualisierung
 * der Fragen in regelmäßigen Abständen auszuführen.
 */

// Konfiguration für den Scheduler
const SCHEDULER_CONFIG = {
  // Cron-Expression für wöchentliche Ausführung (jeden Sonntag um 3 Uhr morgens)
  cronExpression: '0 3 * * 0',
  
  // Flag, um den Scheduler zu aktivieren/deaktivieren
  enabled: true,
  
  // Optionen für node-cron
  options: {
    scheduled: true,
    timezone: 'Europe/Berlin'
  }
};

/**
 * Startet den Scheduler für die automatische Aktualisierung
 */
function startScheduler() {
  if (!SCHEDULER_CONFIG.enabled) {
    console.log('Automatischer Update-Scheduler ist deaktiviert.');
    return;
  }
  
  console.log(`Starte Scheduler für automatische Aktualisierungen (${SCHEDULER_CONFIG.cronExpression})`);
  
  // Starte den Cronjob
  const scheduledTask = cron.schedule(
    SCHEDULER_CONFIG.cronExpression,
    async () => {
      console.log(`[${new Date().toISOString()}] Führe geplante Aktualisierung aus...`);
      try {
        const success = await autoUpdateQuestions();
        if (success) {
          console.log(`[${new Date().toISOString()}] Geplante Aktualisierung erfolgreich abgeschlossen.`);
        } else {
          console.error(`[${new Date().toISOString()}] Geplante Aktualisierung fehlgeschlagen.`);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Fehler bei geplanter Aktualisierung:`, error);
      }
    },
    SCHEDULER_CONFIG.options
  );
  
  console.log('Scheduler wurde erfolgreich gestartet.');
  
  return scheduledTask;
}

// Stelle sicher, dass der Scheduler ordnungsgemäß beendet wird
function gracefulShutdown(scheduledTask: cron.ScheduledTask) {
  console.log('Beende Scheduler...');
  scheduledTask.stop();
  console.log('Scheduler wurde beendet.');
}

// Exportiere die Funktionen, damit sie aus anderen Dateien verwendet werden können
export { startScheduler, gracefulShutdown };

// Bei direkter Ausführung mithilfe eines ESM checker pattern für Node.js

// Für den Fall einer direkten Ausführung aktivieren wir nur die Konsolen-Ausgabe
if (process.argv[1].includes('scheduler.ts')) {
  console.log('Scheduler direkt gestartet');
  const task = startScheduler();
  
  // Ordnungsgemäßes Beenden bei Programmabbruch
  process.on('SIGINT', () => {
    if (task) gracefulShutdown(task);
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    if (task) gracefulShutdown(task);
    process.exit(0);
  });
}