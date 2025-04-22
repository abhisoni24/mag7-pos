import { Table } from '../../redux/tableSlice';
import { StaffMember } from '../../redux/staffSlice';
import { TableStatus } from '@shared/schema';
import { cn } from '@/lib/utils';

interface TableItemProps {
  table: Table;
  waiters: StaffMember[];
  onClick: () => void;
}

const TableItem = ({ table, waiters, onClick }: TableItemProps) => {
  // Get status specific styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-green-500';
      case TableStatus.OCCUPIED:
        return 'bg-red-500';
      case TableStatus.RESERVED:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'text-green-600';
      case TableStatus.OCCUPIED:
        return 'text-red-600';
      case TableStatus.RESERVED:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get waiter name from ID
  const getWaiterName = (waiterId?: string) => {
    if (!waiterId) return '-';
    const waiter = waiters.find(w => w.id === waiterId);
    return waiter ? waiter.name : '-';
  };
  
  // Format reservation time
  const formatReservationTime = (timeString?: string) => {
    if (!timeString) return null;
    
    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return null;
    }
  };
  
  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'Available';
      case TableStatus.OCCUPIED:
        return 'Occupied';
      case TableStatus.RESERVED:
        return 'Reserved';
      default:
        return status;
    }
  };

  return (
    <div 
      className="table-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className={cn("text-white p-2 text-center font-medium", getStatusColor(table.status))}>
        Table {table.number}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Status:</span>
          <span className={cn("text-sm", getStatusTextColor(table.status))}>
            {getStatusDisplayText(table.status)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Seats:</span>
          <span className="text-sm">{table.capacity}</span>
        </div>
        
        {table.status === TableStatus.OCCUPIED && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Guests:</span>
            <span className="text-sm">{table.guestCount || '-'}</span>
          </div>
        )}
        
        {table.status === TableStatus.RESERVED && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Time:</span>
            <span className="text-sm">{formatReservationTime(table.reservationTime) || '-'}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Waiter:</span>
          <span className="text-sm">{getWaiterName(table.waiterId)}</span>
        </div>
      </div>
    </div>
  );
};

export default TableItem;
