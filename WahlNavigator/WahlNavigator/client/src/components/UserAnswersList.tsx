interface UserAnswerDetail {
  id: number;
  topic: string;
  title: string;
  parliament: string;
  year: number;
  userAnswer: string;
  importance: string;
  partyVotes: {
    partyId: number;
    partyName: string;
    partyColor: string;
    vote: string;
  }[];
}

interface UserAnswersListProps {
  answers: UserAnswerDetail[];
}

export default function UserAnswersList({ answers }: UserAnswersListProps) {
  if (!answers || answers.length === 0) return null;
  
  // Helper function to get icon for the topic
  const getTopicIcon = (topic: string | undefined) => {
    if (!topic) return "article";
    
    switch (topic.toLowerCase()) {
      case "umwelt & klima":
        return "eco";
      case "sicherheit":
        return "security";
      case "wirtschaft":
        return "business";
      case "soziales":
        return "people";
      case "bildung":
        return "school";
      case "migration":
        return "public";
      default:
        return "article";
    }
  };
  
  // Helper function to get color for vote
  const getVoteColorClass = (vote: string) => {
    switch (vote) {
      case 'agree':
        return 'text-success';
      case 'disagree':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };
  
  // Helper function to get text for vote
  const getVoteText = (vote: string) => {
    switch (vote) {
      case 'agree':
        return 'Dafür';
      case 'disagree':
        return 'Dagegen';
      default:
        return 'Neutral/Enthaltung';
    }
  };
  
  // Helper function to get icon for importance
  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'low':
        return "arrow_downward";
      case 'high':
        return "arrow_upward";
      default:
        return "remove";
    }
  };
  
  // Helper function to get text for importance
  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'low':
        return 'Weniger wichtig';
      case 'high':
        return 'Sehr wichtig';
      default:
        return 'Normal';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-primary mb-4">Deine Antworten im Detail</h2>
        
        <div className="space-y-6">
          {answers.map((answer) => (
            <div key={answer.id} className="border-b border-neutral-200 pb-4 mb-4 last:border-0">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 p-1 rounded-full bg-accent-light text-white mr-3">
                  <span className="material-icons">{getTopicIcon(answer.topic)}</span>
                </div>
                <div>
                  <h4 className="font-medium">{answer.title}</h4>
                  <p className="text-sm text-neutral-500">{answer.parliament} | {answer.year}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <h5 className="text-sm font-medium mb-1">Deine Position:</h5>
                  <div className={`${getVoteColorClass(answer.userAnswer)} font-medium flex items-center`}>
                    <span className="material-icons mr-1 text-sm">
                      {answer.userAnswer === 'agree' ? 'thumb_up' : answer.userAnswer === 'disagree' ? 'thumb_down' : 'remove'}
                    </span>
                    {getVoteText(answer.userAnswer)}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Wichtigkeit:</h5>
                  <div className="font-medium flex items-center">
                    <span className="material-icons mr-1 text-sm">{getImportanceIcon(answer.importance)}</span>
                    {getImportanceText(answer.importance)}
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium mb-2">Partei-Positionen:</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {answer.partyVotes.map((vote) => {
                    // Get color classes for the party tag
                    let bgColorClass = '';
                    let textColorClass = '';
                    
                    switch (vote.partyColor) {
                      case 'green':
                        bgColorClass = 'bg-green-100';
                        textColorClass = 'text-green-800';
                        break;
                      case 'red':
                        bgColorClass = 'bg-red-100';
                        textColorClass = 'text-red-800';
                        break;
                      case 'black':
                        bgColorClass = 'bg-gray-100';
                        textColorClass = 'text-gray-800';
                        break;
                      case 'yellow':
                        bgColorClass = 'bg-yellow-100';
                        textColorClass = 'text-yellow-800';
                        break;
                      case 'purple':
                        bgColorClass = 'bg-purple-100';
                        textColorClass = 'text-purple-800';
                        break;
                      case 'blue':
                        bgColorClass = 'bg-blue-100';
                        textColorClass = 'text-blue-800';
                        break;
                      default:
                        bgColorClass = 'bg-neutral-100';
                        textColorClass = 'text-neutral-800';
                    }
                    
                    return (
                      <div key={vote.partyId} className={`flex items-center text-xs ${bgColorClass} ${textColorClass} px-2 py-1 rounded`}>
                        <span className={`w-2 h-2 bg-${vote.partyColor === 'black' ? 'black' : vote.partyColor}-${vote.partyColor === 'black' ? '' : '600'} rounded-full mr-1`}></span>
                        {vote.partyName}: {getVoteText(vote.vote)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
