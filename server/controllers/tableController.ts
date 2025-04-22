import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertTable, TableStatus } from '@shared/schema';

export const getTables = async (req: Request, res: Response) => {
  try {
    const { status, floor, waiterId } = req.query;
    
    let tables;
    
    if (status) {
      tables = await storage.getTablesByStatus(status as string);
    } else if (floor) {
      tables = await storage.getTablesByFloor(parseInt(floor as string));
    } else if (waiterId) {
      tables = await storage.getTablesByWaiter(waiterId as string);
    } else {
      tables = await storage.getTables();
    }
    
    res.json({ tables });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getTable = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.id;
    const table = await storage.getTable(tableId);
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    res.json({ table });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const { number, capacity, floor } = req.body;
    
    // Check if table number already exists
    const tables = await storage.getTables();
    const tableExists = tables.some(table => table.number === number);
    
    if (tableExists) {
      return res.status(400).json({ message: 'Table with this number already exists' });
    }
    
    const newTable: InsertTable = {
      number,
      capacity,
      floor: floor || 1,
      status: TableStatus.AVAILABLE
    };
    
    const createdTable = await storage.createTable(newTable);
    
    res.status(201).json({ table: createdTable });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.id;
    const updates = req.body;
    
    // If changing status to occupied, waiterId is required
    if (updates.status === TableStatus.OCCUPIED && !updates.waiterId) {
      return res.status(400).json({ message: 'Waiter must be assigned to an occupied table' });
    }
    
    // If changing to available, clear waiter and guest info
    if (updates.status === TableStatus.AVAILABLE) {
      updates.waiterId = undefined;
      updates.guestCount = undefined;
      updates.reservationName = undefined;
      updates.reservationPhone = undefined;
      updates.reservationTime = undefined;
    }
    
    const updatedTable = await storage.updateTable(tableId, updates);
    
    if (!updatedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    res.json({ table: updatedTable });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};
