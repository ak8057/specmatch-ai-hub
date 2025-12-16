export type RFPStatus = 'New' | 'In Progress' | 'Completed';
export type Priority = 'High' | 'Medium' | 'Low';
export type AgentType = 'Sales' | 'Technical' | 'Pricing' | 'Main';
export type LogLevel = 'Info' | 'Success' | 'Warning' | 'Error';
export type UserRole = 'Sales' | 'Technical' | 'Pricing';

export interface RFP {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  status: RFPStatus;
  priority: Priority;
  description?: string;
  scope?: string;
  requirements?: string[];
  products?: string[];
}

export interface LineItem {
  id: string;
  name: string;
  rfpSpec: string;
  recommendedSku: string;
  matchPercentage: number;
  oemProducts: OEMProduct[];
}

export interface OEMProduct {
  sku: string;
  matchPercentage: number;
  specs: Record<string, string>;
}

export interface MaterialPricing {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface TestService {
  name: string;
  cost: number;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentType: AgentType;
  rfpId?: string;
  message: string;
  level: LogLevel;
}

export interface PipelineStep {
  name: string;
  agent: AgentType;
  status: 'Pending' | 'Running' | 'Done' | 'Error';
  timestamp?: string;
  description: string;
}

export interface DataSource {
  id: string;
  url: string;
  name: string;
  lastScanned?: string;
  status: 'Active' | 'Inactive';
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ActivityItem {
  id: number;
  rfpId: string;
  message: string;
  time: string;
}

export interface DashboardStats {
  openRFPs: number;
  dueSoon: number;
  avgTurnaround: number;
  avgSpecMatch: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export type PipelineStatus = 'Pending' | 'Running' | 'Done' | 'Error';
