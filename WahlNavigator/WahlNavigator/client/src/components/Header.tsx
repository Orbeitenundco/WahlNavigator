import { Link } from "wouter";
import { Vote } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
              <Vote className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-primary dark:text-primary-light">Wahl-O-Mat</h1>
          </Link>
        </div>
        <div className="flex items-center">
          <nav className="mr-6">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light transition font-medium">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light transition font-medium">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/guestbook" className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light transition font-medium">
                  Kontakt
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
