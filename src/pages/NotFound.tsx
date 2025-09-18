import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertCircle, X } from "lucide-react";

interface ImportantDate {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "Admission" | "Exam" | "Deadline" | "Event";
  location?: string;
  notes?: string;
}

export default function ImportantDates() {
  const [dates] = useState<ImportantDate[]>([
    {
      id: "d1",
      title: "TS EAMCET 2025 Registration",
      description: "Start of online application for Telangana Engineering, Agriculture & Medical entrance test.",
      date: "2025-03-01",
      type: "Admission",
      notes: "Late fee applicable after March 20.",
    },
    {
      id: "d2",
      title: "Intermediate 2nd Year Board Exams",
      description: "Final examinations for 12th students in Telangana State.",
      date: "2025-03-10",
      type: "Exam",
      location: "Statewide Exam Centers",
    },
    {
      id: "d3",
      title: "Last Date for Degree Admissions (Phase 1)",
      description: "Final date to apply for Degree colleges under DOST portal.",
      date: "2025-06-15",
      type: "Deadline",
      notes: "Keep scanned documents ready before applying.",
    },
    {
      id: "d4",
      title: "Hyderabad Career Fair 2025",
      description: "Mega event for career guidance and college fairs.",
      date: "2025-07-05",
      type: "Event",
      location: "Hyderabad Exhibition Ground",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ✅ Navigation Bar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-blue-600">Career View</h1>
          <div className="flex gap-6 text-sm">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/colleges" className="hover:text-blue-600">Colleges</Link>
            <Link to="/roadmaps" className="hover:text-blue-600">Roadmap</Link>
            <Link to="/important-dates" className="text-blue-600 font-medium">Important Dates</Link>
          </div>
          <Button variant="outline" size="sm">Sign Out</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>Stay updated with upcoming exams, admissions and deadlines</CardDescription>
          </CardHeader>
        </Card>

        {/* ✅ Dates List */}
        {dates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dates.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDate(item)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  {item.location && <Badge variant="outline">{item.location}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No important dates available at the moment.</p>
          </Card>
        )}
      </div>

      {/* ✅ Date Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedDate(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {selectedDate.title}
            </h2>
            <p className="text-gray-600 mb-4">{selectedDate.description}</p>

            <div className="space-y-2">
              <p><strong>Date:</strong> {selectedDate.date}</p>
              <p><strong>Type:</strong> {selectedDate.type}</p>
              {selectedDate.location && <p><strong>Location:</strong> {selectedDate.location}</p>}
              {selectedDate.notes && <p><strong>Notes:</strong> {selectedDate.notes}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
