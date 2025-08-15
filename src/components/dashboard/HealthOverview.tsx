
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Thermometer, Scale } from "lucide-react";

const HealthOverview = () => {
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: "72 bpm",
      status: "Normal",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      status: "Good",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Temperature",
      value: "98.6°F",
      status: "Normal",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Weight",
      value: "65 kg",
      status: "Stable",
      icon: Scale,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Overview</CardTitle>
        <CardDescription>Your latest health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <metric.icon className={metric.color} size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="font-semibold">{metric.value}</p>
                <Badge variant="secondary" className="text-xs">
                  {metric.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthOverview;
