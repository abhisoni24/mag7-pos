/**
 * Table Controller
 * 
 * This module handles table-related operations including retrieving, creating,
 * and updating tables in the restaurant.
 * 
 * @module controllers/tableController
 */
import { Request, Response } from 'express';
import { storage } from '../storage';
import { InsertTable, TableStatus } from '@shared/schema';

/**
 * GET /tables
 * Fetch tables, optionally filtered by status, floor, or assigned waiter
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of table documents
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
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

/**
 * GET /tables/:id
 * Fetch a specific table by ID
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Table document
 * @throws {404} If table is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
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

/**
 * POST /tables
 * Create a new table
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Created table document
 * @throws {400} If table number already exists or there's a validation error
 * @throws {500} If there's a server error
 */
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

/**
 * PUT /tables/:id
 * Update an existing table
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated table document
 * @throws {400} If changing to occupied status without waiterId or there's a validation error
 * @throws {404} If table is not found
 * @throws {500} If there's a server error
 */
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
