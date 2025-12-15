import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { RFP, AgentLog, DataSource, PipelineStep, LineItem, ActivityItem, DashboardStats } from '@/types';
import { 
  mockRFPs as initialRFPs, 
  mockAgentLogs as initialLogs, 
  mockDataSources as initialDataSources,
  mockPipelineSteps as initialPipelineSteps,
  mockLineItems as initialLineItems,
  dashboardStats as initialDashboardStats,
  recentActivity as initialRecentActivity,
} from '@/data/mockData';

interface AppSettings {
  autoScan: boolean;
  autoTechnical: boolean;
  autoPricing: boolean;
  defaultMarkup: string;
  currency: string;
}

interface AppContextType {
  // Data
  rfps: RFP[];
  agentLogs: AgentLog[];
  dataSources: DataSource[];
  pipelineSteps: Record<string, PipelineStep[]>;
  lineItems: Record<string, LineItem[]>;
  recentActivity: ActivityItem[];
  dashboardStats: DashboardStats;
  settings: AppSettings;

  // Loading states
  isScanning: boolean;
  runningPipelines: Set<string>;

  // Actions
  addRFP: (rfp: Omit<RFP, 'id'>) => void;
  updateRFPStatus: (rfpId: string, status: RFP['status']) => void;
  addAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  addDataSource: (source: Omit<DataSource, 'id'>) => void;
  removeDataSource: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addActivityItem: (item: Omit<ActivityItem, 'id'>) => void;
  updateDashboardStats: (stats: Partial<DashboardStats>) => void;
  
  // Simulated actions
  scanForRFPs: () => Promise<RFP[]>;
  runFullPipeline: (rfpId: string) => Promise<void>;
  runSalesAgent: (rfpId: string) => Promise<void>;
  runTechnicalAgent: (rfpId: string) => Promise<void>;
  runPricingAgent: (rfpId: string) => Promise<void>;
  updatePipelineStep: (rfpId: string, stepIndex: number, status: PipelineStep['status']) => void;
  updateLineItemMatch: (rfpId: string, lineItemId: string, newMatch: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateRFPId = () => `MR-${100 + Math.floor(Math.random() * 900)}`;

const newRFPTemplates = [
  { title: 'Transmission Line Cable Supply', client: 'Power Grid Corporation', priority: 'High' as const },
  { title: 'Underground Metro Cabling', client: 'Mumbai Metro Rail', priority: 'Medium' as const },
  { title: 'Industrial Plant Wiring', client: 'Reliance Industries', priority: 'High' as const },
  { title: 'Airport Lighting Cables', client: 'AAI', priority: 'Low' as const },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [rfps, setRFPs] = useState<RFP[]>(initialRFPs);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>(initialLogs);
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);
  const [pipelineSteps, setPipelineSteps] = useState<Record<string, PipelineStep[]>>({
    default: initialPipelineSteps,
  });
  const [lineItems, setLineItems] = useState<Record<string, LineItem[]>>({
    default: initialLineItems,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(initialRecentActivity);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initialDashboardStats);
  const [settings, setSettings] = useState<AppSettings>({
    autoScan: true,
    autoTechnical: true,
    autoPricing: false,
    defaultMarkup: '15',
    currency: 'INR',
  });

  const [isScanning, setIsScanning] = useState(false);
  const [runningPipelines, setRunningPipelines] = useState<Set<string>>(new Set());

  const addAgentLog = useCallback((log: Omit<AgentLog, 'id' | 'timestamp'>) => {
    const newLog: AgentLog = {
      ...log,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    setAgentLogs(prev => [newLog, ...prev]);
  }, []);

  const addActivityItem = useCallback((item: Omit<ActivityItem, 'id'>) => {
    const newItem: ActivityItem = {
      ...item,
      id: Date.now(),
    };
    setRecentActivity(prev => [newItem, ...prev.slice(0, 9)]);
  }, []);

  const updateDashboardStats = useCallback((stats: Partial<DashboardStats>) => {
    setDashboardStats(prev => ({ ...prev, ...stats }));
  }, []);

  const addRFP = useCallback((rfp: Omit<RFP, 'id'>) => {
    const newRFP: RFP = {
      ...rfp,
      id: generateRFPId(),
    };
    setRFPs(prev => [newRFP, ...prev]);
    updateDashboardStats({ openRFPs: dashboardStats.openRFPs + 1 });
  }, [dashboardStats.openRFPs, updateDashboardStats]);

  const updateRFPStatus = useCallback((rfpId: string, status: RFP['status']) => {
    setRFPs(prev => prev.map(rfp => rfp.id === rfpId ? { ...rfp, status } : rfp));
  }, []);

  const addDataSource = useCallback((source: Omit<DataSource, 'id'>) => {
    const newSource: DataSource = {
      ...source,
      id: generateId(),
    };
    setDataSources(prev => [...prev, newSource]);
  }, []);

  const removeDataSource = useCallback((id: string) => {
    setDataSources(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updatePipelineStep = useCallback((rfpId: string, stepIndex: number, status: PipelineStep['status']) => {
    setPipelineSteps(prev => {
      const steps = prev[rfpId] || [...initialPipelineSteps.map(s => ({ ...s, status: 'Pending' as const }))];
      const updatedSteps = steps.map((step, i) => 
        i === stepIndex 
          ? { ...step, status, timestamp: status === 'Done' ? new Date().toISOString() : step.timestamp }
          : step
      );
      return { ...prev, [rfpId]: updatedSteps };
    });
  }, []);

  const updateLineItemMatch = useCallback((rfpId: string, lineItemId: string, newMatch: number) => {
    setLineItems(prev => {
      const items = prev[rfpId] || initialLineItems;
      const updatedItems = items.map(item =>
        item.id === lineItemId ? { ...item, matchPercentage: newMatch } : item
      );
      return { ...prev, [rfpId]: updatedItems };
    });
  }, []);

  // Simulated async actions
  const scanForRFPs = useCallback(async (): Promise<RFP[]> => {
    setIsScanning(true);
    addAgentLog({
      agentType: 'Sales',
      message: 'Starting scan of configured tender portals...',
      level: 'Info',
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const numFound = Math.floor(Math.random() * 3) + 1;
    const newRFPs: RFP[] = [];

    for (let i = 0; i < numFound; i++) {
      const template = newRFPTemplates[Math.floor(Math.random() * newRFPTemplates.length)];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 10);
      
      const newRFP: RFP = {
        id: generateRFPId(),
        title: template.title,
        client: template.client,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'New',
        priority: template.priority,
        description: `Auto-discovered RFP from tender portal scan.`,
        scope: 'Scope to be analyzed by Technical Agent.',
        requirements: ['To be extracted'],
        products: ['To be identified'],
      };
      newRFPs.push(newRFP);
    }

    setRFPs(prev => [...newRFPs, ...prev]);
    
    addAgentLog({
      agentType: 'Sales',
      message: `Scan complete. Found ${numFound} new RFP(s) matching criteria.`,
      level: 'Success',
    });

    newRFPs.forEach(rfp => {
      addActivityItem({
        rfpId: rfp.id,
        message: `New RFP discovered · ${rfp.client}`,
        time: 'Just now',
      });
    });

    updateDashboardStats({ openRFPs: dashboardStats.openRFPs + numFound });
    setIsScanning(false);
    
    return newRFPs;
  }, [addAgentLog, addActivityItem, dashboardStats.openRFPs, updateDashboardStats]);

  const runSalesAgent = useCallback(async (rfpId: string) => {
    addAgentLog({
      agentType: 'Sales',
      rfpId,
      message: `Starting RFP analysis for ${rfpId}...`,
      level: 'Info',
    });

    updatePipelineStep(rfpId, 0, 'Running');
    await new Promise(resolve => setTimeout(resolve, 1200));

    updatePipelineStep(rfpId, 0, 'Done');
    addAgentLog({
      agentType: 'Sales',
      rfpId,
      message: `RFP details extracted. Identified ${3 + Math.floor(Math.random() * 3)} line items.`,
      level: 'Success',
    });
  }, [addAgentLog, updatePipelineStep]);

  const runTechnicalAgent = useCallback(async (rfpId: string) => {
    addAgentLog({
      agentType: 'Technical',
      rfpId,
      message: `Starting SpecMatch analysis for ${rfpId}...`,
      level: 'Info',
    });

    updatePipelineStep(rfpId, 1, 'Running');
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Generate random match percentages for line items
    const items = lineItems[rfpId] || initialLineItems;
    items.forEach(item => {
      const newMatch = 75 + Math.floor(Math.random() * 25);
      updateLineItemMatch(rfpId, item.id, newMatch);
    });

    const avgMatch = 85 + Math.floor(Math.random() * 12);
    updatePipelineStep(rfpId, 1, 'Done');
    
    addAgentLog({
      agentType: 'Technical',
      rfpId,
      message: `SpecMatch complete. Average match: ${avgMatch}%. ${items.length} items processed.`,
      level: 'Success',
    });

    updateDashboardStats({ avgSpecMatch: avgMatch });
  }, [addAgentLog, updatePipelineStep, lineItems, updateLineItemMatch, updateDashboardStats]);

  const runPricingAgent = useCallback(async (rfpId: string) => {
    addAgentLog({
      agentType: 'Pricing',
      rfpId,
      message: `Calculating pricing for ${rfpId}...`,
      level: 'Info',
    });

    updatePipelineStep(rfpId, 2, 'Running');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalCost = 500000 + Math.floor(Math.random() * 1000000);
    updatePipelineStep(rfpId, 2, 'Done');
    
    addAgentLog({
      agentType: 'Pricing',
      rfpId,
      message: `Pricing complete. Total quote: ₹${totalCost.toLocaleString()}.`,
      level: 'Success',
    });
  }, [addAgentLog, updatePipelineStep]);

  const runFullPipeline = useCallback(async (rfpId: string) => {
    setRunningPipelines(prev => new Set(prev).add(rfpId));
    
    // Initialize pipeline steps for this RFP
    setPipelineSteps(prev => ({
      ...prev,
      [rfpId]: initialPipelineSteps.map(s => ({ ...s, status: 'Pending' as const, timestamp: undefined })),
    }));

    addAgentLog({
      agentType: 'Main',
      rfpId,
      message: `Starting full agent pipeline for ${rfpId}...`,
      level: 'Info',
    });

    updateRFPStatus(rfpId, 'In Progress');

    // Step 1: Sales
    await runSalesAgent(rfpId);

    // Step 2: Technical
    await runTechnicalAgent(rfpId);

    // Step 3: Pricing
    await runPricingAgent(rfpId);

    // Step 4: Final
    updatePipelineStep(rfpId, 3, 'Running');
    await new Promise(resolve => setTimeout(resolve, 800));
    updatePipelineStep(rfpId, 3, 'Done');

    addAgentLog({
      agentType: 'Main',
      rfpId,
      message: `Pipeline complete. Response document ready for review.`,
      level: 'Success',
    });

    updateRFPStatus(rfpId, 'Completed');
    
    addActivityItem({
      rfpId,
      message: 'Full pipeline completed · Quote ready',
      time: 'Just now',
    });

    setRunningPipelines(prev => {
      const next = new Set(prev);
      next.delete(rfpId);
      return next;
    });
  }, [addAgentLog, updateRFPStatus, runSalesAgent, runTechnicalAgent, runPricingAgent, updatePipelineStep, addActivityItem]);

  const value: AppContextType = {
    rfps,
    agentLogs,
    dataSources,
    pipelineSteps,
    lineItems,
    recentActivity,
    dashboardStats,
    settings,
    isScanning,
    runningPipelines,
    addRFP,
    updateRFPStatus,
    addAgentLog,
    addDataSource,
    removeDataSource,
    updateSettings,
    addActivityItem,
    updateDashboardStats,
    scanForRFPs,
    runFullPipeline,
    runSalesAgent,
    runTechnicalAgent,
    runPricingAgent,
    updatePipelineStep,
    updateLineItemMatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
