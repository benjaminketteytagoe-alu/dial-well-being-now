
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Emily Johnson",
      specialty: "General Medicine",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Check-up",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Gynecology",
      date: "Friday",
      time: "2:00 PM",
      type: "Consultation",
      status: "pending"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar size={20} />
          <span>Upcoming Appointments</span>
        </CardTitle>
        <CardDescription>Your scheduled visits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="text-gray-500" size={16} />
                  <span className="font-medium">{appointment.doctor}</span>
                </div>
                <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                  {appointment.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{appointment.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{appointment.time}</span>
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            View All Appointments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
