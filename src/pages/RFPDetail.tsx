import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MatchBadge } from '@/components/common/MatchBadge';
import { mockRFPs, mockLineItems, mockMaterialPricing, mockTestServices, mockPipelineSteps } from '@/data/mockData';
import { LineItem, PipelineStep } from '@/types';
import { Play, FileText, Cog, DollarSign, Check, Loader2, Clock, AlertCircle, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function RFPDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedLineItem, setSelectedLineItem] = useState<LineItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const rfp = mockRFPs.find((r) => r.id === id) || mockRFPs[1];

  const handleRunPipeline = (type: string) => {
    toast({
      title: `${type} Started`,
      description: `Running ${type.toLowerCase()} for RFP #${rfp.id}`,
    });
  };

  const handleViewDetails = (item: LineItem) => {
    setSelectedLineItem(item);
    setIsSheetOpen(true);
  };

  const handleExportPDF = () => {
    toast({
      title: 'Exporting PDF',
      description: 'Generating response document...',
    });
  };

  const getStepIcon = (step: PipelineStep) => {
    switch (step.status) {
      case 'Done':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Running':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'Error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const totalMaterial = mockMaterialPricing.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalTests = mockTestServices.reduce((sum, item) => sum + item.cost, 0);
  const grandTotal = totalMaterial + totalTests;

  // Calculate spec match stats
  const above90 = mockLineItems.filter((item) => item.matchPercentage >= 90).length;
  const between80and90 = mockLineItems.filter((item) => item.matchPercentage >= 80 && item.matchPercentage < 90).length;
  const below80 = mockLineItems.filter((item) => item.matchPercentage < 80).length;
  const avgMatch = Math.round(mockLineItems.reduce((sum, item) => sum + item.matchPercentage, 0) / mockLineItems.length);

  return (
    <AppLayout title={`RFP #${rfp.id}`}>
      <div className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">{rfp.title}</h2>
                  <StatusBadge status={rfp.status} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>ID: <strong className="text-foreground">{rfp.id}</strong></span>
                  <span>Client: <strong className="text-foreground">{rfp.client}</strong></span>
                  <span>Due: <strong className="text-foreground">{format(new Date(rfp.dueDate), 'MMM dd, yyyy')}</strong></span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleRunPipeline('Full Agent Pipeline')}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Full Pipeline
                </Button>
                <Button variant="outline" onClick={() => handleRunPipeline('Sales Scan')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Sales Scan
                </Button>
                <Button variant="outline" onClick={() => handleRunPipeline('Technical SpecMatch')}>
                  <Cog className="mr-2 h-4 w-4" />
                  SpecMatch
                </Button>
                <Button variant="outline" onClick={() => handleRunPipeline('Pricing')}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Pricing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Matching</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Quote</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">RFP Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Scope</h4>
                    <p className="text-sm">{rfp.scope}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Key Requirements</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {rfp.requirements?.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Discovered Products in Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {rfp.products?.map((product, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent Pipeline Status</CardTitle>
                <CardDescription>Current status of the automated workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {mockPipelineSteps.map((step, i) => (
                      <div key={i} className="relative flex gap-4">
                        <div className={cn(
                          "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2",
                          step.status === 'Done' ? 'border-green-500 bg-green-50' :
                          step.status === 'Running' ? 'border-primary bg-primary/10' :
                          step.status === 'Error' ? 'border-destructive bg-destructive/10' :
                          'border-muted bg-muted'
                        )}>
                          {getStepIcon(step)}
                        </div>
                        <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium">{step.name}</h4>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{step.agent}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.timestamp && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Matching Tab */}
          <TabsContent value="technical" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Average Match</p>
                  <p className="text-3xl font-bold text-primary">{avgMatch}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Line Items</p>
                  <p className="text-3xl font-bold">{mockLineItems.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Match ≥90%</p>
                  <p className="text-3xl font-bold text-green-600">{above90}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Match &lt;80%</p>
                  <p className="text-3xl font-bold text-red-600">{below80}</p>
                </CardContent>
              </Card>
            </div>

            {/* Line Items Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Line Item Matching</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Line Item</TableHead>
                      <TableHead>Recommended OEM SKU</TableHead>
                      <TableHead>SpecMatch %</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-sm">{item.recommendedSku}</TableCell>
                        <TableCell>
                          <MatchBadge percentage={item.matchPercentage} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Material Pricing</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>OEM SKU</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMaterialPricing.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div>
                              <p className="font-mono text-sm">{item.sku}</p>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">₹{item.lineTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Testing & Services</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTestServices.map((test, i) => (
                        <TableRow key={i}>
                          <TableCell>{test.name}</TableCell>
                          <TableCell className="text-right font-medium">₹{test.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Quote Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Quote Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Material Cost</span>
                    <span className="font-medium">₹{totalMaterial.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Testing Cost</span>
                    <span className="font-medium">₹{totalTests.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-2xl font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Response as PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Line Item Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Specification Comparison</SheetTitle>
            <SheetDescription>
              RFP requirement vs. OEM product matches
            </SheetDescription>
          </SheetHeader>
          {selectedLineItem && (
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="font-medium mb-2">{selectedLineItem.name}</h4>
                <p className="text-sm text-muted-foreground">RFP Spec: {selectedLineItem.rfpSpec}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>RFP Spec</TableHead>
                    {selectedLineItem.oemProducts.map((oem) => (
                      <TableHead key={oem.sku}>
                        <div className="space-y-1">
                          <span className="font-mono text-xs">{oem.sku}</span>
                          <MatchBadge percentage={oem.matchPercentage} size="sm" />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(selectedLineItem.oemProducts[0].specs).map((param) => (
                    <TableRow key={param}>
                      <TableCell className="font-medium">{param}</TableCell>
                      <TableCell className="text-primary">
                        {selectedLineItem.oemProducts[0].specs[param].split(',')[0]}
                      </TableCell>
                      {selectedLineItem.oemProducts.map((oem) => (
                        <TableCell key={oem.sku}>{oem.specs[param]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
