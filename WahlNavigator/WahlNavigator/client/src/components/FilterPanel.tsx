import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FilterPanel() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [levelFilters, setLevelFilters] = useState({
    federal: true,
    state: true
  });
  
  const { data: topics, isLoading } = useQuery({
    queryKey: ['/api/topics'],
  });
  
  const [topicFilters, setTopicFilters] = useState<Record<string, boolean>>({});
  
  // Initialize topic filters once data is loaded
  useState(() => {
    if (topics && Object.keys(topicFilters).length === 0) {
      const initialTopicFilters: Record<string, boolean> = {};
      topics.forEach((topic: any) => {
        initialTopicFilters[topic.id] = true;
      });
      setTopicFilters(initialTopicFilters);
    }
  });
  
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    // Save filter to local storage or context
    localStorage.setItem('timeFilter', value);
    
    // Update the API filter
    updateFilters();
  };
  
  const handleLevelFilterChange = (level: 'federal' | 'state', checked: boolean) => {
    setLevelFilters(prev => ({
      ...prev,
      [level]: checked
    }));
    
    // Save filter to local storage
    localStorage.setItem('levelFilters', JSON.stringify({
      ...levelFilters,
      [level]: checked
    }));
    
    // Update the API filter
    updateFilters();
  };
  
  const handleTopicFilterChange = (topicId: string, checked: boolean) => {
    setTopicFilters(prev => ({
      ...prev,
      [topicId]: checked
    }));
    
    // Save filter to local storage
    localStorage.setItem('topicFilters', JSON.stringify({
      ...topicFilters,
      [topicId]: checked
    }));
    
    // Update the API filter
    updateFilters();
  };
  
  const updateFilters = async () => {
    try {
      // Send the current filter settings to the backend
      await apiRequest('POST', '/api/filters', {
        timeFilter,
        levelFilters,
        topicFilters
      });
      
      toast({
        title: "Filter aktualisiert",
        description: "Die Fragen wurden entsprechend gefiltert.",
      });
      
      // Invalidate questions cache to trigger a reload
      // Uncommenting this would cause a real API call
      // queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
    } catch (error) {
      toast({
        title: "Fehler beim Aktualisieren der Filter",
        description: "Bitte versuche es später erneut.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-4">Filter &amp; Einstellungen</h2>
        <div className="space-y-6">
          <div>
            <Label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">Zeitraum</Label>
            <RadioGroup 
              defaultValue="all" 
              value={timeFilter}
              onValueChange={handleTimeFilterChange}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center">
                <RadioGroupItem value="all" id="time-all" />
                <Label htmlFor="time-all" className="ml-2 dark:text-neutral-300">Alle (letzte 10 Jahre)</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="5years" id="time-5years" />
                <Label htmlFor="time-5years" className="ml-2 dark:text-neutral-300">Letzte 5 Jahre</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="2years" id="time-2years" />
                <Label htmlFor="time-2years" className="ml-2 dark:text-neutral-300">Letzte 2 Jahre</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">Politische Ebene</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Checkbox 
                  id="level-federal" 
                  checked={levelFilters.federal}
                  onCheckedChange={(checked) => handleLevelFilterChange('federal', checked === true)}
                />
                <Label htmlFor="level-federal" className="ml-2 dark:text-neutral-300">Bundesebene</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="level-state" 
                  checked={levelFilters.state}
                  onCheckedChange={(checked) => handleLevelFilterChange('state', checked === true)}
                />
                <Label htmlFor="level-state" className="ml-2 dark:text-neutral-300">Landesebene</Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block text-neutral-700 dark:text-neutral-200 font-medium mb-2">Themenbereiche</Label>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topics && topics.map((topic: any) => (
                  <div key={topic.id} className="flex items-center">
                    <Checkbox 
                      id={`topic-${topic.id}`} 
                      checked={topicFilters[topic.id] || false}
                      onCheckedChange={(checked) => handleTopicFilterChange(topic.id, checked === true)}
                    />
                    <Label htmlFor={`topic-${topic.id}`} className="ml-2 dark:text-neutral-300">{topic.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
