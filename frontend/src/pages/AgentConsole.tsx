import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/context/AppContext';
import { AgentType } from '@/types';
import { Search, Terminal, Bot, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const agentColors: Record<AgentType, string> = {
  Sales: 'text-blue-600 bg-blue-100',
  Technical: 'text-purple-600 bg-purple-100',
  Pricing: 'text-green-600 bg-green-100',
  Main: 'text-slate-600 bg-slate-100',
};

export default function AgentConsole() {
  const { agentLogs } = useApp();
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return agentLogs.filter((log) => {
      const matchesAgent = agentFilter === 'all' || log.agentType === agentFilter;
      const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
      const matchesSearch =
        !searchQuery ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.rfpId && log.rfpId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesAgent && matchesSearch && matchesLevel;
    });
  }, [agentLogs, agentFilter, levelFilter, searchQuery]);

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredLogs]);

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Count logs by agent type from current data
  const agentCounts = useMemo(() => {
    return (['Sales', 'Technical', 'Pricing', 'Main'] as AgentType[]).map(agent => ({
      agent,
      count: agentLogs.filter(l => l.agentType === agent).length,
    }));
  }, [agentLogs]);

  return (
    <AppLayout title="Agent Console">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {agentCounts.map(({ agent, count }) => (
            <Card 
              key={agent}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                agentFilter === agent && "ring-2 ring-primary"
              )}
              onClick={() => setAgentFilter(agentFilter === agent ? 'all' : agent)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn('rounded-lg p-3', agentColors[agent])}>
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{agent} Agent</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by RFP ID or message..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={agentFilter} onValueChange={(v) => { setAgentFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="Sales">Sales Agent</SelectItem>
                  <SelectItem value="Technical">Technical Agent</SelectItem>
                  <SelectItem value="Pricing">Pricing Agent</SelectItem>
                  <SelectItem value="Main">Main Orchestrator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(v) => { setLevelFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => {
                setSearchQuery('');
                setAgentFilter('all');
                setLevelFilter('all');
                setCurrentPage(1);
              }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Log Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Agent Activity Log
              <span className="text-sm font-normal text-muted-foreground">
                ({sortedLogs.length} entries)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No log entries found matching your criteria
                </div>
              ) : (
                paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      'rounded-lg border p-4 transition-colors',
                      log.level === 'Error' && 'border-destructive/50 bg-destructive/5',
                      log.level === 'Warning' && 'border-amber-500/50 bg-amber-50',
                      log.level === 'Success' && 'border-green-500/50 bg-green-50',
                      log.level === 'Info' && 'border-border bg-muted/30'
                    )}
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn('rounded-md px-2 py-1 text-xs font-medium', agentColors[log.agentType])}>
                          {log.agentType}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-mono">{log.message}</p>
                          {log.rfpId && (
                            <p className="text-xs text-muted-foreground">
                              RFP: <span className="font-medium text-primary">{log.rfpId}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={log.level} type="log" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border mt-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, sortedLogs.length)} of {sortedLogs.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
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
