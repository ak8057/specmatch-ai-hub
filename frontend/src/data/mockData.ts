import { RFP, LineItem, MaterialPricing, TestService, AgentLog, PipelineStep, DataSource, User } from '@/types';

export const currentUser: User = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  role: 'Sales',
};

export const mockRFPs: RFP[] = [
  {
    id: 'MR-101',
    title: 'Power Cable Supply for Metro Rail Project',
    client: 'Delhi Metro Rail Corporation',
    dueDate: '2024-02-15',
    status: 'New',
    priority: 'High',
    description: 'Supply of various power cables for the new metro line extension project.',
    scope: 'Supply of LT and HT power cables for underground metro stations and depot.',
    requirements: ['IS 7098 compliance', 'Fire retardant cables', 'Armoured construction'],
    products: ['4 sqmm FR Cable, 1.1kV', '16 sqmm Armoured Cable, 3.3kV', '95 sqmm HT Cable, 11kV'],
  },
  {
    id: 'MR-102',
    title: 'Industrial Wiring for Steel Plant Expansion',
    client: 'Tata Steel Limited',
    dueDate: '2024-02-20',
    status: 'In Progress',
    priority: 'High',
    description: 'Complete wiring solution for the new steel plant expansion.',
    scope: 'Supply of industrial cables for furnace area and control systems.',
    requirements: ['High temperature resistance', 'Oil resistant', 'Flame retardant'],
    products: ['2.5 sqmm Control Cable', '6 sqmm Power Cable, 1.1kV', '35 sqmm Welding Cable'],
  },
  {
    id: 'MR-103',
    title: 'Solar Farm Cable Installation',
    client: 'Adani Green Energy',
    dueDate: '2024-03-01',
    status: 'New',
    priority: 'Medium',
    description: 'DC and AC cables for 500MW solar power plant.',
    scope: 'Supply of solar DC cables and AC transmission cables.',
    requirements: ['UV resistant', 'Double insulation', 'TUV certified'],
    products: ['4 sqmm Solar DC Cable', '10 sqmm Solar DC Cable', '240 sqmm AC Cable'],
  },
  {
    id: 'MR-104',
    title: 'Building Wiring - Commercial Complex',
    client: 'DLF Limited',
    dueDate: '2024-02-28',
    status: 'Completed',
    priority: 'Medium',
    description: 'Complete electrical wiring for new commercial tower.',
    scope: 'LT cables for floors 1-25, including common areas.',
    requirements: ['FRLS cables', 'Low smoke', 'Halogen free'],
    products: ['1.5 sqmm FRLS Wire', '2.5 sqmm FRLS Wire', '4 sqmm FRLS Cable'],
  },
  {
    id: 'MR-105',
    title: 'Oil Refinery Cable Replacement',
    client: 'Indian Oil Corporation',
    dueDate: '2024-03-10',
    status: 'New',
    priority: 'Low',
    description: 'Replacement of aging cables in refinery processing units.',
    scope: 'Supply of instrumentation and power cables for hazardous areas.',
    requirements: ['ATEX certified', 'Chemical resistant', 'Armoured'],
    products: ['1.5 sqmm Instrument Cable', '16 sqmm Power Cable', '25 sqmm Control Cable'],
  },
  {
    id: 'MR-106',
    title: 'Hospital Infrastructure Upgrade',
    client: 'AIIMS Delhi',
    dueDate: '2024-02-25',
    status: 'In Progress',
    priority: 'High',
    description: 'Critical power infrastructure upgrade for hospital complex.',
    scope: 'Supply of medical-grade power cables and UPS wiring.',
    requirements: ['Zero halogen', 'Fire survival', 'EMI shielded'],
    products: ['6 sqmm Medical Grade Cable', '10 sqmm Fire Survival Cable'],
  },
];

export const mockLineItems: LineItem[] = [
  {
    id: '1',
    name: '4 sqmm FR Cable, 1.1kV',
    rfpSpec: '4 sqmm, Copper, FR PVC, 1.1kV, IS 7098',
    recommendedSku: 'FRC-4C-1100',
    matchPercentage: 96,
    oemProducts: [
      {
        sku: 'FRC-4C-1100',
        matchPercentage: 96,
        specs: { Size: '4 sqmm', Voltage: '1.1kV', Insulation: 'FR PVC', Conductor: 'Copper', Standard: 'IS 7098' },
      },
      {
        sku: 'FRC-4C-1100-P',
        matchPercentage: 92,
        specs: { Size: '4 sqmm', Voltage: '1.1kV', Insulation: 'FR XLPE', Conductor: 'Copper', Standard: 'IS 7098' },
      },
      {
        sku: 'FRC-4A-1100',
        matchPercentage: 85,
        specs: { Size: '4 sqmm', Voltage: '1.1kV', Insulation: 'FR PVC', Conductor: 'Aluminium', Standard: 'IS 7098' },
      },
    ],
  },
  {
    id: '2',
    name: '16 sqmm Armoured Cable, 3.3kV',
    rfpSpec: '16 sqmm, Copper, XLPE, 3.3kV, Armoured',
    recommendedSku: 'ARM-16C-3300',
    matchPercentage: 94,
    oemProducts: [
      {
        sku: 'ARM-16C-3300',
        matchPercentage: 94,
        specs: { Size: '16 sqmm', Voltage: '3.3kV', Insulation: 'XLPE', Conductor: 'Copper', Armour: 'Steel Wire' },
      },
      {
        sku: 'ARM-16C-3300-T',
        matchPercentage: 89,
        specs: { Size: '16 sqmm', Voltage: '3.3kV', Insulation: 'XLPE', Conductor: 'Copper', Armour: 'Steel Tape' },
      },
      {
        sku: 'ARM-25C-3300',
        matchPercentage: 78,
        specs: { Size: '25 sqmm', Voltage: '3.3kV', Insulation: 'XLPE', Conductor: 'Copper', Armour: 'Steel Wire' },
      },
    ],
  },
  {
    id: '3',
    name: '95 sqmm HT Cable, 11kV',
    rfpSpec: '95 sqmm, Copper, XLPE, 11kV, Screened',
    recommendedSku: 'HT-95C-11000',
    matchPercentage: 91,
    oemProducts: [
      {
        sku: 'HT-95C-11000',
        matchPercentage: 91,
        specs: { Size: '95 sqmm', Voltage: '11kV', Insulation: 'XLPE', Conductor: 'Copper', Screen: 'Copper Tape' },
      },
      {
        sku: 'HT-95C-11000-W',
        matchPercentage: 88,
        specs: { Size: '95 sqmm', Voltage: '11kV', Insulation: 'XLPE', Conductor: 'Copper', Screen: 'Copper Wire' },
      },
      {
        sku: 'HT-120C-11000',
        matchPercentage: 82,
        specs: { Size: '120 sqmm', Voltage: '11kV', Insulation: 'XLPE', Conductor: 'Copper', Screen: 'Copper Tape' },
      },
    ],
  },
];

export const mockMaterialPricing: MaterialPricing[] = [
  { sku: 'FRC-4C-1100', description: '4 sqmm FR Cable, 1.1kV', quantity: 5000, unitPrice: 85, lineTotal: 425000 },
  { sku: 'ARM-16C-3300', description: '16 sqmm Armoured Cable, 3.3kV', quantity: 2000, unitPrice: 210, lineTotal: 420000 },
  { sku: 'HT-95C-11000', description: '95 sqmm HT Cable, 11kV', quantity: 500, unitPrice: 850, lineTotal: 425000 },
];

export const mockTestServices: TestService[] = [
  { name: 'High Voltage Test', cost: 15000 },
  { name: 'Insulation Resistance Test', cost: 8000 },
  { name: 'Conductor Resistance Test', cost: 5000 },
  { name: 'Spark Test', cost: 3000 },
];

export const mockAgentLogs: AgentLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00',
    agentType: 'Sales',
    message: 'Scanned 5 government portal URLs. Found 2 new RFPs matching criteria.',
    level: 'Success',
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:32:00',
    agentType: 'Sales',
    rfpId: 'MR-101',
    message: 'Extracted RFP details from DMRC tender portal. Title: Power Cable Supply for Metro Rail Project.',
    level: 'Info',
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:35:00',
    agentType: 'Technical',
    rfpId: 'MR-102',
    message: 'Generated SpecMatch analysis. Average match: 93%. 3 line items processed.',
    level: 'Success',
  },
  {
    id: '4',
    timestamp: '2024-01-15T10:40:00',
    agentType: 'Pricing',
    rfpId: 'MR-102',
    message: 'Calculated total quote: ₹12,70,000. Material: ₹12,40,000, Testing: ₹30,000.',
    level: 'Success',
  },
  {
    id: '5',
    timestamp: '2024-01-15T10:42:00',
    agentType: 'Main',
    rfpId: 'MR-102',
    message: 'Pipeline completed. Response document ready for review.',
    level: 'Success',
  },
  {
    id: '6',
    timestamp: '2024-01-15T09:15:00',
    agentType: 'Sales',
    message: 'Starting scheduled scan of tender portals...',
    level: 'Info',
  },
  {
    id: '7',
    timestamp: '2024-01-15T09:18:00',
    agentType: 'Technical',
    rfpId: 'MR-103',
    message: 'Warning: Low match percentage (72%) for item "240 sqmm AC Cable". Manual review recommended.',
    level: 'Warning',
  },
  {
    id: '8',
    timestamp: '2024-01-15T08:00:00',
    agentType: 'Sales',
    message: 'Failed to connect to CPPP portal. Retrying in 5 minutes.',
    level: 'Error',
  },
];

export const mockPipelineSteps: PipelineStep[] = [
  {
    name: 'RFP Discovery',
    agent: 'Sales',
    status: 'Done',
    timestamp: '2024-01-15T10:30:00',
    description: 'Scanned tender portals and extracted RFP details.',
  },
  {
    name: 'Technical Matching',
    agent: 'Technical',
    status: 'Done',
    timestamp: '2024-01-15T10:35:00',
    description: 'Analyzed specifications and matched with OEM products.',
  },
  {
    name: 'Pricing Calculation',
    agent: 'Pricing',
    status: 'Running',
    description: 'Computing material costs and testing charges.',
  },
  {
    name: 'Response Generation',
    agent: 'Main',
    status: 'Pending',
    description: 'Compiling final response document.',
  },
];

export const mockDataSources: DataSource[] = [
  { id: '1', url: 'https://eprocure.gov.in', name: 'Central Public Procurement Portal', lastScanned: '2024-01-15T10:00:00', status: 'Active' },
  { id: '2', url: 'https://gem.gov.in', name: 'GeM Portal', lastScanned: '2024-01-15T09:30:00', status: 'Active' },
  { id: '3', url: 'https://tender.railnet.gov.in', name: 'Indian Railways Tender', lastScanned: '2024-01-15T08:00:00', status: 'Active' },
  { id: '4', url: 'https://ntpctender.com', name: 'NTPC Tenders', status: 'Inactive' },
];

export const dashboardStats = {
  openRFPs: 4,
  dueSoon: 3,
  avgTurnaround: 48,
  avgSpecMatch: 91,
};

export const weeklyRFPData = [
  { week: 'W1', responded: 5, won: 3 },
  { week: 'W2', responded: 8, won: 5 },
  { week: 'W3', responded: 6, won: 4 },
  { week: 'W4', responded: 10, won: 7 },
  { week: 'W5', responded: 7, won: 5 },
  { week: 'W6', responded: 9, won: 6 },
];

export const recentActivity = [
  { id: 1, rfpId: 'MR-102', message: 'SpecMatch avg 93% · Quote ready', time: '2 hours ago' },
  { id: 2, rfpId: 'MR-101', message: 'New RFP discovered · Technical review pending', time: '4 hours ago' },
  { id: 3, rfpId: 'MR-104', message: 'Response submitted · Awaiting result', time: '1 day ago' },
  { id: 4, rfpId: 'MR-103', message: 'Technical matching in progress', time: '1 day ago' },
];

export const monthlyAnalytics = {
  rfpsProcessed: 24,
  avgSpecMatch: 89,
  avgTurnaround: 42,
  autoGenerated: 18,
  manualEdited: 6,
};
