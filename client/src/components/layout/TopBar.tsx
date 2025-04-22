import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Menu } from 'lucide-react';

interface TopBarProps {
  pageTitle: string;
  toggleMobileSidebar: () => void;
}

const TopBar = ({ pageTitle, toggleMobileSidebar }: TopBarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  function getCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          className="mr-4 md:hidden text-gray-600 hover:text-gray-900"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-poppins font-semibold text-gray-800">{pageTitle}</h2>
      </div>
      
      <div className="flex items-center">
        <div className="hidden md:flex items-center mr-4">
          <Clock className="mr-2 h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium">{currentTime}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-error w-2 h-2 rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
