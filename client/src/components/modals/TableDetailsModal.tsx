import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../redux/tableSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Table as TableType } from '../../redux/tableSlice';
import { StaffMember } from '../../redux/staffSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableStatus, UserRole } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableType;
  waiters: StaffMember[];
  onCreateOrder: () => void;
  canChangeStatus: boolean;
}

const TableDetailsModal = ({
  isOpen,
  onClose,
  table,
  waiters,
  onCreateOrder,
  canChangeStatus
}: TableDetailsModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Form state
  const [status, setStatus] = useState<string>(table.status);
  const [guestCount, setGuestCount] = useState<number>(table.guestCount || 1);
  const [waiterId, setWaiterId] = useState<string>(table.waiterId || '');
  const [reservationTime, setReservationTime] = useState<string>('');
  const [reservationName, setReservationName] = useState<string>(table.reservationName || '');
  const [reservationPhone, setReservationPhone] = useState<string>(table.reservationPhone || '');
  
  // Reset form when table changes
  useEffect(() => {
    setStatus(table.status);
    setGuestCount(table.guestCount || 1);
    setWaiterId(table.waiterId || '');
    setReservationName(table.reservationName || '');
    setReservationPhone(table.reservationPhone || '');
    
    // Format reservation time for input
    if (table.reservationTime) {
      const time = new Date(table.reservationTime);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setReservationTime(`${hours}:${minutes}`);
    } else {
      setReservationTime('');
    }
  }, [table]);
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
  };
  
  const handleSave = async () => {
    try {
      // Prepare updates
      const updates: any = { status };
      
      // Add additional fields based on status
      if (status === TableStatus.OCCUPIED) {
        if (!waiterId) {
          toast({
            variant: "destructive",
            title: "Validation error",
            description: "A waiter must be assigned to an occupied table.",
          });
          return;
        }
        
        updates.waiterId = waiterId;
        updates.guestCount = guestCount;
        updates.reservationName = '';
        updates.reservationPhone = '';
        updates.reservationTime = null;
      } else if (status === TableStatus.RESERVED) {
        updates.reservationName = reservationName;
        updates.reservationPhone = reservationPhone;
        
        // Parse reservation time
        if (reservationTime) {
          const [hours, minutes] = reservationTime.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          updates.reservationTime = date.toISOString();
        } else {
          updates.reservationTime = null;
        }
      } else if (status === TableStatus.AVAILABLE) {
        updates.waiterId = null;
        updates.guestCount = null;
        updates.reservationName = '';
        updates.reservationPhone = '';
        updates.reservationTime = null;
      }
      
      await dispatch(updateTable({ id: table._id, data: updates })).unwrap();
      
      toast({
        title: "Table updated",
        description: `Table ${table.number} has been updated successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error as string || "An error occurred while updating the table.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Table {table.number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={status === TableStatus.AVAILABLE ? "default" : "outline"}
                onClick={() => canChangeStatus && handleStatusChange(TableStatus.AVAILABLE)}
                disabled={!canChangeStatus}
                className={
                  status === TableStatus.AVAILABLE 
                    ? "bg-green-500 hover:bg-green-600" 
                    : ""
                }
              >
                Available
              </Button>
              <Button
                type="button"
                variant={status === TableStatus.OCCUPIED ? "default" : "outline"}
                onClick={() => canChangeStatus && handleStatusChange(TableStatus.OCCUPIED)}
                disabled={!canChangeStatus}
                className={
                  status === TableStatus.OCCUPIED 
                    ? "bg-red-500 hover:bg-red-600" 
                    : ""
                }
              >
                Occupied
              </Button>
              <Button
                type="button"
                variant={status === TableStatus.RESERVED ? "default" : "outline"}
                onClick={() => canChangeStatus && handleStatusChange(TableStatus.RESERVED)}
                disabled={!canChangeStatus}
                className={
                  status === TableStatus.RESERVED 
                    ? "bg-yellow-500 hover:bg-yellow-600" 
                    : ""
                }
              >
                Reserved
              </Button>
            </div>
          </div>
          
          {status === TableStatus.OCCUPIED && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="num-guests">Number of Guests</Label>
                <Input
                  id="num-guests"
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={table.capacity}
                />
              </div>
              
              <div>
                <Label htmlFor="waiter-assign">Assign Waiter</Label>
                <Select
                  value={waiterId}
                  onValueChange={setWaiterId}
                >
                  <SelectTrigger id="waiter-assign">
                    <SelectValue placeholder="Select a waiter" />
                  </SelectTrigger>
                  <SelectContent>
                    {waiters.map((waiter) => (
                      <SelectItem key={waiter.id} value={waiter.id}>
                        {waiter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {status === TableStatus.RESERVED && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reservation-time">Reservation Time</Label>
                <Input
                  id="reservation-time"
                  type="time"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="reservation-name">Name</Label>
                <Input
                  id="reservation-name"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  placeholder="Customer name"
                />
              </div>
              
              <div>
                <Label htmlFor="reservation-phone">Phone</Label>
                <Input
                  id="reservation-phone"
                  value={reservationPhone}
                  onChange={(e) => setReservationPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {/* Always show Create Order for occupied tables */}
            {status === TableStatus.OCCUPIED && (
              <Button 
                className="flex-1 bg-primary text-white hover:bg-primary-dark"
                onClick={onCreateOrder}
              >
                Create Order
              </Button>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            // All roles including waiters can save changes to table status
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableDetailsModal;
