
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Pill, FileText, Heart } from "lucide-react";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: "symptom_check",
      title: "Symptom Check Completed",
      description: "Mild headache assessment",
      time: "2 hours ago",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 2,
      type: "medication",
      title: "Medication Reminder",
      description: "Iron supplement taken",
      time: "4 hours ago",
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 3,
      type: "record",
      title: "Health Record Updated",
      description: "Blood pressure logged",
      time: "1 day ago",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: 4,
      type: "vitals",
      title: "Vitals Recorded",
      description: "Heart rate: 72 bpm",
      time: "2 days ago",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest health activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${activity.bgColor} flex-shrink-0`}>
                <activity.icon className={activity.color} size={16} />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
