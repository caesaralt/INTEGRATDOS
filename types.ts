import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  SALES = 'SALES'
}

export interface Permission {
  module: string;
  access: boolean;
  subPermissions?: Record<string, boolean>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: Permission[];
}

export interface Quote {
  id: string;
  projectName: string;
  clientName: string;
  total: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  date: string;
  pricingTier?: 'Basic' | 'Premium' | 'Deluxe';
}

export interface CanvasItem {
  id: string;
  uid: number;
  type?: string;
  x: number;
  y: number;
  label: string;
  cost: number;
  color?: string;
  icon?: any;
  rotation?: number;
  scale?: number;
  selected?: boolean;
}

export interface CanvasTool {
  id: string;
  icon: React.ElementType;
  label: string;
  category: 'lighting' | 'power' | 'climate' | 'security' | 'av';
}

export interface CRMData {
  clients: number;
  activeProjects: number;
  revenue: number;
  pendingQuotes: number;
}

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};

export interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}