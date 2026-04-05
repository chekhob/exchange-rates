interface LastUpdatedProps {
  timestamp: string; // Last updated UTC timestamp from API
  nextUpdate?: string; // Next update UTC timestamp (optional)
}

export const LastUpdated = ({ timestamp, nextUpdate }: LastUpdatedProps) => {
  const formatTime = (utcString: string) => {
    try {
      const date = new Date(utcString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).format(date);
    } catch {
      return utcString;
    }
  };

  const timeAgo = (utcString: string) => {
    try {
      const date = new Date(utcString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
      return formatTime(utcString);
    } catch {
      return '';
    }
  };

  const getNextUpdateDisplay = () => {
    if (nextUpdate) {
      try {
        const date = new Date(nextUpdate);
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date);
      } catch {
        return 'scheduled time';
      }
    }
    
    // Fallback: calculate 24 hours from last update
    try {
      const date = new Date(timestamp);
      date.setHours(date.getHours() + 24);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return 'tomorrow';
    }
  };

  return (
    <div className="text-sm text-gray-600">
      <p>
        Last updated: <span className="font-medium">{formatTime(timestamp)}</span>
        <span className="ml-2 text-gray-500">({timeAgo(timestamp)})</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Next update scheduled for{' '}
        <span className="font-medium">
          {getNextUpdateDisplay()}
        </span>
      </p>
    </div>
  );
};