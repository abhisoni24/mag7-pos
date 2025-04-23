import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTables,
  selectTable as selectTableAction,
  Table as TableType
} from '../../redux/tableSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchStaff } from '../../redux/staffSlice';
import TableItem from '../../components/tables/TableItem';
import TableDetailsModal from '../../components/modals/TableDetailsModal';
import CreateOrderModal from '../../components/modals/CreateOrderModal';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { UserRole } from '@shared/schema';

const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tables, loading } = useSelector((state: RootState) => state.tables);
  const { staff } = useSelector((state: RootState) => state.staff);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showTableModal, setShowTableModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedWaiter, setSelectedWaiter] = useState('all');
  
  // Fetch tables and staff on component mount
  useEffect(() => {
    dispatch(fetchTables({}));
    dispatch(fetchStaff('waiter'));
  }, [dispatch]);
  
  // Filter tables based on floor and waiter
  const filteredTables = tables.filter(table => {
    const floorMatch = table.floor.toString() === selectedFloor;
    const waiterMatch = selectedWaiter === 'all' || table.waiterId === selectedWaiter;
    return floorMatch && waiterMatch;
  });
  
  // Default setting for table filters
  useEffect(() => {
    // Initially set to "all" for all users to make sure tables show up
    setSelectedWaiter('all');
  }, []);
  
  const handleTableClick = (table: TableType) => {
    setSelectedTable(table);
    dispatch(selectTableAction(table));
    setShowTableModal(true);
  };
  
  const handleTableModalClose = () => {
    setShowTableModal(false);
  };
  
  const handleOrderModalClose = () => {
    setShowOrderModal(false);
  };
  
  const handleCreateOrder = () => {
    setShowTableModal(false);
    setShowOrderModal(true);
  };
  
  // Check if user is allowed to change table status
  const canChangeTableStatus = () => {
    // Let host and managers and above change table status completely
    if (user) {
      const allowedRoles = ['host', 'manager', 'owner', 'admin'];
      if (allowedRoles.includes(user.role)) {
        return true;
      }
    }
    
    // Waiters can access tables but not change status (they can create orders)
    return false;
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div>
            <Label htmlFor="floor-select" className="mb-1">Floor</Label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger id="floor-select" className="w-[180px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {user && ['manager', 'owner', 'host'].includes(user.role) && (
            <div>
              <Label htmlFor="waiter-select" className="mb-1">Filter by Waiter</Label>
              <Select value={selectedWaiter} onValueChange={setSelectedWaiter}>
                <SelectTrigger id="waiter-select" className="w-[180px]">
                  <SelectValue placeholder="Select Waiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Waiters</SelectItem>
                  {staff.map(waiter => (
                    <SelectItem key={waiter.id} value={waiter.id}>
                      {waiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex items-end">
          <div className="flex space-x-2">
            <span className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Available
            </span>
            <span className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Occupied
            </span>
            <span className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Reserved
            </span>
          </div>
        </div>
      </div>
      
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map(table => (
              <TableItem 
                key={table._id} 
                table={table} 
                waiters={staff}
                onClick={() => handleTableClick(table)}
              />
            ))}
            
            {filteredTables.length === 0 && (
              <div className="col-span-full flex justify-center items-center h-40 text-gray-500">
                No tables found for the selected filters
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Modals */}
      {selectedTable && (
        <>
          <TableDetailsModal
            isOpen={showTableModal}
            onClose={handleTableModalClose}
            table={selectedTable}
            waiters={staff}
            onCreateOrder={handleCreateOrder}
            canChangeStatus={canChangeTableStatus()}
          />
          
          <CreateOrderModal
            isOpen={showOrderModal}
            onClose={handleOrderModalClose}
            table={selectedTable}
          />
        </>
      )}
    </div>
  );
};

export default Tables;
