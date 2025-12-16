import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/AppContext';
import { weeklyRFPData } from '@/data/mockData';
import { FileText, Clock, Gauge, Target, Radar, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { dashboardStats, recentActivity, scanForRFPs, isScanning } = useApp();

  const handleScanForRFPs = async () => {
    toast({
      title: 'Scanning for new RFPs...',
      description: 'The Sales Agent is scanning configured tender portals.',
    });
    
    try {
      const newRFPs = await scanForRFPs();
      toast({
        title: 'Scan Complete',
        description: `Found ${newRFPs.length} new RFP(s) matching your criteria.`,
      });
    } catch (error) {
      toast({
        title: 'Scan Failed',
        description: 'Could not complete the scan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Open RFPs"
            value={dashboardStats.openRFPs}
            subtitle="Awaiting response"
            icon={FileText}
            trend={{ value: 12, positive: true }}
          />
          <KPICard
            title="Due in 30 Days"
            value={dashboardStats.dueSoon}
            subtitle="Urgent attention needed"
            icon={Clock}
          />
          <KPICard
            title="Avg Turnaround"
            value={`${dashboardStats.avgTurnaround}h`}
            subtitle="From discovery to response"
            icon={Gauge}
            trend={{ value: 8, positive: true }}
          />
          <KPICard
            title="Avg SpecMatch"
            value={`${dashboardStats.avgSpecMatch}%`}
            subtitle="Product match accuracy"
            icon={Target}
            trend={{ value: 3, positive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">RFPs Responded per Week</CardTitle>
              <CardDescription>Weekly response volume and success rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRFPData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="responded" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Responded" />
                    <Bar dataKey="won" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Won" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Win Rate Trend</CardTitle>
              <CardDescription>Success rate over the last 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyRFPData.map(d => ({ ...d, winRate: Math.round((d.won / d.responded) * 100) }))}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="winRate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Win Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & CTA */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest agent runs and RFP updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                ) : (
                  recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">RFP #{activity.rfpId} processed</p>
                          <p className="text-sm text-muted-foreground">{activity.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/rfp/${activity.rfpId}`)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Trigger agent workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleScanForRFPs} 
                className="w-full" 
                size="lg"
                disabled={isScanning}
              >
                {isScanning ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Radar className="mr-2 h-5 w-5" />
                )}
                {isScanning ? 'Scanning...' : 'Scan for New RFPs'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/rfp-explorer')}
              >
                <FileText className="mr-2 h-5 w-5" />
                View All RFPs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
