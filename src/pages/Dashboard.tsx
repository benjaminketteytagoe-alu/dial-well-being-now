
// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HealthOverview from "@/components/dashboard/HealthOverview";
import RecentActivities from "@/components/dashboard/RecentActivities";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import QuickActions from "@/components/dashboard/QuickActions";
import HealthTips from "@/components/dashboard/HealthTips";
import UserAnalytics from "@/components/dashboard/UserAnalytics";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HealthOverview />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingAppointments />
              <HealthTips />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <UserAnalytics />
          </TabsContent>
          
          <TabsContent value="health" className="space-y-6">
            <HealthOverview />
            <RecentActivities />
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-6">
            <RecentActivities />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
