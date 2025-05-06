import { Link } from "wouter";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-neutral-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Über Wahl-O-Mat</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Der Wahl-O-Mat zeigt dir, welche Partei am besten zu deinen politischen Einstellungen passt, basierend auf echten Abstimmungen.
            </p>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-200 mb-2">Teile den Wahl-O-Mat:</h4>
              <div className="flex space-x-4">
                <a href="https://twitter.com/intent/tweet?url=https://wahlomat.de&text=Ich habe gerade den Wahl-O-Mat genutzt, um meine politische Position zu bestimmen!" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://wahlomat.de" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://wahlomat.de" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Datenschutz</Link></li>
              <li><Link href="/about" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Über uns</Link></li>
              <li><Link href="/learn-more" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Mehr erfahren</Link></li>
              <li><Link href="/guestbook" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Kontakt</Link></li>
              <li><Link href="/methodology" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Methodik</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quellen</h3>
            <ul className="space-y-2">
              <li><a href="https://www.bundestag.de/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Deutscher Bundestag</a></li>
              <li><a href="https://www.bundesrat.de/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Bundesrat</a></li>
              <li><a href="https://www.abgeordnetenwatch.de/bundestag/abstimmungen" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Abstimmungsdatenbank</a></li>
              <li><a href="https://www.bundeswahlleiter.de/parteien.html" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition">Wahlprogramme der Parteien</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-gray-700 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">© {new Date().getFullYear()} Wahl-O-Mat. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
