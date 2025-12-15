import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTableControls } from '@/hooks/useTableControls';
import { RFP } from '@/types';
import { Search, Plus, Download, ChevronLeft, ChevronRight, ExternalLink, Play, ArrowUpDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function RFPExplorer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rfps, addRFP, runFullPipeline, runningPipelines } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRFP, setNewRFP] = useState({
    title: '',
    client: '',
    dueDate: '',
    description: '',
  });

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    paginatedData,
    setFilter,
    filters,
    handleSort,
    sortConfig,
    exportToCSV,
  } = useTableControls<RFP>({
    data: rfps,
    itemsPerPage: 5,
    searchKeys: ['id', 'title', 'client'],
  });

  const handleExportCSV = () => {
    exportToCSV('rfp-export', [
      { key: 'id', label: 'RFP ID' },
      { key: 'title', label: 'Title' },
      { key: 'client', label: 'Client' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
    ]);
    toast({
      title: 'Export Complete',
      description: `Exported ${totalItems} RFPs to CSV.`,
    });
  };

  const handleRunAgents = async (rfpId: string) => {
    toast({
      title: 'Pipeline Started',
      description: `Running full agent pipeline for RFP #${rfpId}`,
    });
    await runFullPipeline(rfpId);
    toast({
      title: 'Pipeline Complete',
      description: `All agents finished for RFP #${rfpId}`,
    });
  };

  const handleAddRFP = (e: React.FormEvent) => {
    e.preventDefault();
    addRFP({
      title: newRFP.title,
      client: newRFP.client,
      dueDate: newRFP.dueDate,
      status: 'New',
      priority: 'Medium',
      description: newRFP.description,
      scope: 'To be analyzed',
      requirements: ['To be extracted'],
      products: ['To be identified'],
    });
    setIsAddModalOpen(false);
    setNewRFP({ title: '', client: '', dueDate: '', description: '' });
    toast({
      title: 'RFP Added',
      description: 'New RFP has been added successfully.',
    });
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === column ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
    </TableHead>
  );

  return (
    <AppLayout title="RFP Explorer">
      <div className="space-y-6">
        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, title, or client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value) => setFilter('status', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.priority || 'all'} 
                  onValueChange={(value) => setFilter('priority', value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add RFP Manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add RFP Manually</DialogTitle>
                      <DialogDescription>
                        Enter the details of the RFP you want to add to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddRFP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">RFP Title</Label>
                        <Input 
                          id="title" 
                          placeholder="e.g., Power Cable Supply Project" 
                          required 
                          value={newRFP.title}
                          onChange={(e) => setNewRFP(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client">Client Name</Label>
                        <Input 
                          id="client" 
                          placeholder="e.g., Delhi Metro Rail Corporation" 
                          required 
                          value={newRFP.client}
                          onChange={(e) => setNewRFP(prev => ({ ...prev, client: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Submission Due Date</Label>
                        <Input 
                          id="dueDate" 
                          type="date" 
                          required 
                          value={newRFP.dueDate}
                          onChange={(e) => setNewRFP(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document">RFP Document</Label>
                        <Input id="document" type="file" accept=".pdf,.doc,.docx" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the RFP requirements..."
                          rows={3}
                          value={newRFP.description}
                          onChange={(e) => setNewRFP(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save RFP</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RFP Table */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              All RFPs
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({totalItems} total)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="id">RFP ID</SortableHeader>
                  <SortableHeader column="title">Title / Project</SortableHeader>
                  <SortableHeader column="client">Client</SortableHeader>
                  <SortableHeader column="dueDate">Due Date</SortableHeader>
                  <SortableHeader column="status">Status</SortableHeader>
                  <SortableHeader column="priority">Priority</SortableHeader>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No RFPs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((rfp) => {
                    const isRunning = runningPipelines.has(rfp.id);
                    return (
                      <TableRow key={rfp.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-primary">{rfp.id}</TableCell>
                        <TableCell>
                          <div className="max-w-[250px] truncate" title={rfp.title}>
                            {rfp.title}
                          </div>
                        </TableCell>
                        <TableCell>{rfp.client}</TableCell>
                        <TableCell>{format(new Date(rfp.dueDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <StatusBadge status={rfp.status} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={rfp.priority} type="priority" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/rfp/${rfp.id}`)}
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Open
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRunAgents(rfp.id)}
                              disabled={isRunning}
                            >
                              {isRunning ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              ) : (
                                <Play className="mr-1 h-3 w-3" />
                              )}
                              {isRunning ? 'Running...' : 'Run Agents'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * 5 + 1} to{' '}
                  {Math.min(currentPage * 5, totalItems)} of {totalItems} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          className="w-8"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
