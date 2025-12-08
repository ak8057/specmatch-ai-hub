import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockDataSources } from '@/data/mockData';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Settings() {
  const { toast } = useToast();
  const [autoScan, setAutoScan] = useState(true);
  const [autoTechnical, setAutoTechnical] = useState(true);
  const [autoPricing, setAutoPricing] = useState(false);
  const [defaultMarkup, setDefaultMarkup] = useState('15');
  const [currency, setCurrency] = useState('INR');
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
    });
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddSourceOpen(false);
    toast({
      title: 'Data Source Added',
      description: 'New URL has been added to scan list.',
    });
  };

  const handleDeleteSource = (id: string) => {
    toast({
      title: 'Data Source Removed',
      description: 'URL has been removed from scan list.',
    });
  };

  return (
    <AppLayout title="Settings">
      <div className="space-y-6 max-w-4xl">
        {/* Agent Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Settings</CardTitle>
            <CardDescription>Configure automation behavior for the agent pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-scan">Auto-scan URLs</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically scan configured tender portals for new RFPs
                </p>
              </div>
              <Switch id="auto-scan" checked={autoScan} onCheckedChange={setAutoScan} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-technical">Auto-run Technical Agent</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start SpecMatch analysis when new RFPs are discovered
                </p>
              </div>
              <Switch id="auto-technical" checked={autoTechnical} onCheckedChange={setAutoTechnical} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-pricing">Auto-run Pricing Agent</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically calculate pricing after technical matching completes
                </p>
              </div>
              <Switch id="auto-pricing" checked={autoPricing} onCheckedChange={setAutoPricing} />
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Data Sources</CardTitle>
                <CardDescription>URLs monitored for RFP discovery</CardDescription>
              </div>
              <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Source
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Data Source</DialogTitle>
                    <DialogDescription>
                      Add a new URL to scan for RFP documents.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input id="source-name" placeholder="e.g., Government e-Marketplace" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source-url">URL</Label>
                      <Input id="source-url" type="url" placeholder="https://example.gov.in/tenders" required />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddSourceOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Source</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Last Scanned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDataSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {source.url.replace('https://', '')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {source.lastScanned
                        ? format(new Date(source.lastScanned), 'MMM dd, HH:mm')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={source.status === 'Active' ? 'In Progress' : 'Completed'}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pricing Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing Configuration</CardTitle>
            <CardDescription>Default values for quote generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="markup">Default Markup (%)</Label>
                <Input
                  id="markup"
                  type="number"
                  value={defaultMarkup}
                  onChange={(e) => setDefaultMarkup(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
