import { Table } from "../../redux/tableSlice";
import { StaffMember } from "../../redux/staffSlice";
import { TableStatus } from "@shared/schema";
import { cn } from "@/lib/utils";

/**
 * @interface TableItemProps
 * @description Interface for the props of the TableItem component.
 * @param {Table} table - The table object to display.
 * @param {StaffMember[]} waiters - An array of staff members to assign as waiters.
 * @param {function} onClick - A function to call when the table item is clicked.
 */
interface TableItemProps {
  table: Table;
  waiters: StaffMember[];
  onClick: () => void;
}

/**
 * @component TableItem
 * @description Displays a summary of a table, including its status, capacity, and assigned waiter.
 * @param {TableItemProps} props - The props for the TableItem component.
 * @returns {JSX.Element} - The table item element.
 */
const TableItem = ({ table, waiters, onClick }: TableItemProps) => {
  /**
   * @function getStatusColor
   * @description Gets the background color based on the table status.
   * @param {string} status - The table status.
   * @returns {string} - The background color class name.
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return "bg-green-500";
      case TableStatus.OCCUPIED:
        return "bg-red-500";
      case TableStatus.RESERVED:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  /**
   * @function getStatusTextColor
   * @description Gets the text color based on the table status.
   * @param {string} status - The table status.
   * @returns {string} - The text color class name.
   */
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return "text-green-600";
      case TableStatus.OCCUPIED:
        return "text-red-600";
      case TableStatus.RESERVED:
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  /**
   * @function getWaiterName
   * @description Gets the name of the waiter assigned to the table.
   * @param {string} waiterId - The ID of the waiter.
   * @returns {string} - The name of the waiter, or '-' if no waiter is assigned.
   */
  const getWaiterName = (waiterId?: string) => {
    if (!waiterId) return "-";
    const waiter = waiters.find((w) => w.id === waiterId);
    return waiter ? waiter.name : "-";
  };

  /**
   * @function formatReservationTime
   * @description Formats the reservation time.
   * @param {string} timeString - The reservation time string.
   * @returns {string} - The formatted reservation time, or null if the time is invalid.
   */
  const formatReservationTime = (timeString?: string) => {
    if (!timeString) return null;

    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return null;
    }
  };

  /**
   * @function getStatusDisplayText
   * @description Gets the display text for the table status.
   * @param {string} status - The table status.
   * @returns {string} - The display text for the table status.
   */
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return "Available";
      case TableStatus.OCCUPIED:
        return "Occupied";
      case TableStatus.RESERVED:
        return "Reserved";
      default:
        return status;
    }
  };

  return (
    <div
      className="table-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div
        className={cn(
          "text-white p-2 text-center font-medium",
          getStatusColor(table.status)
        )}
      >
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
            <span className="text-sm">{table.guestCount || "-"}</span>
          </div>
        )}

        {table.status === TableStatus.RESERVED && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Time:</span>
            <span className="text-sm">
              {formatReservationTime(table.reservationTime) || "-"}
            </span>
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
