import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap, MapPin, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface UserProfile {
  id: string;
  name: string;
  class_completed: string;
  district: string;
}

interface College {
  id: string;
  name: string;
  district: string;
  eligibility: string;
  programs: string[];
  facilities: string[];
  contact?: {
    phone: string;
    email: string;
  };
}

export default function Colleges() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserAndColleges();
    }
  }, [user]);

  const fetchUserAndColleges = async () => {
    try {
      // ✅ Get current user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("id, name, class_completed, district")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (profileData) {
        let nextEligibility: string[] = [];

        // ✅ Define next-level eligibility
        if (profileData.class_completed === "10th") {
          nextEligibility = ["Intermediate qualification", "SSC Qualification"];
        } else if (profileData.class_completed === "Intermediate") {
          nextEligibility = ["Bachelor''s qualification", "JEE Main Qualified", "NEET Qualified"];
        }

        // ✅ Fetch colleges
        const { data: collegesData, error: collegesError } = await supabase
          .from("colleges")
          .select("*")
          .ilike("district", `%${profileData.district}%`)
          .in("eligibility", nextEligibility);

        if (collegesError) throw collegesError;
        setColleges(collegesData || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading colleges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ✅ Navigation Bar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-blue-600">Career View</h1>
          <div className="flex gap-6 text-sm">
            <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
            <a href="/colleges" className="text-blue-600 font-medium">Colleges</a>
            <a href="/quiz" className="hover:text-blue-600">Quiz</a>
            <a href="/roadmap" className="hover:text-blue-600">Roadmaps</a>
          </div>
          <Button variant="outline" size="sm">Sign Out</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* ✅ Student Details */}
        {profile && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>We are showing colleges based on your next study level</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge variant="secondary">Name: {profile.name}</Badge>
              <Badge variant="outline">Completed: {profile.class_completed}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.district}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* ✅ Colleges List */}
        {colleges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <Card
                key={college.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCollege(college)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {college.name}
                  </CardTitle>
                  <CardDescription>
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {college.district}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Eligibility: {college.eligibility}</Badge>
                  <Badge variant="outline">Programs: {college.programs.join(", ")}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No colleges found for your next level of study.</p>
          </Card>
        )}
      </div>

      {/* ✅ College Details Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedCollege(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              {selectedCollege.name}
            </h2>
            <p className="text-gray-600 mb-4">{selectedCollege.district}</p>

            <div className="space-y-2">
              <p><strong>Eligibility:</strong> {selectedCollege.eligibility}</p>
              <p><strong>Programs:</strong> {selectedCollege.programs.join(", ")}</p>
              <p><strong>Facilities:</strong> {selectedCollege.facilities.join(", ")}</p>
              <p><strong>Contact:</strong></p>
              <ul className="ml-4 list-disc text-gray-700">
                <li>📞 {selectedCollege.contact?.phone}</li>
                <li>📧 {selectedCollege.contact?.email}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}