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
import { mockRFPs } from '@/data/mockData';
import { RFP, RFPStatus } from '@/types';
import { Search, Plus, Download, ChevronLeft, ChevronRight, ExternalLink, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function RFPExplorer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Filter RFPs
  const filteredRFPs = mockRFPs.filter((rfp) => {
    const matchesSearch =
      rfp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rfp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRFPs.length / itemsPerPage);
  const paginatedRFPs = filteredRFPs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    toast({
      title: 'Export Started',
      description: 'Downloading RFP list as CSV...',
    });
  };

  const handleRunAgents = (rfpId: string) => {
    toast({
      title: 'Agents Started',
      description: `Running full pipeline for RFP #${rfpId}`,
    });
  };

  const handleAddRFP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddModalOpen(false);
    toast({
      title: 'RFP Added',
      description: 'New RFP has been added successfully.',
    });
  };

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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                        <Input id="title" placeholder="e.g., Power Cable Supply Project" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client">Client Name</Label>
                        <Input id="client" placeholder="e.g., Delhi Metro Rail Corporation" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Submission Due Date</Label>
                        <Input id="dueDate" type="date" required />
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
                ({filteredRFPs.length} total)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">RFP ID</TableHead>
                  <TableHead>Title / Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRFPs.map((rfp) => (
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
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Run Agents
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredRFPs.length)} of {filteredRFPs.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
