import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  ChevronRight, 
  Briefcase, 
  GraduationCap,
  Building,
  Lightbulb,
  Loader2,
  ChevronLeft,
  ArrowDown
} from "lucide-react";
import { Link } from "react-router-dom";

interface Roadmap {
  id: string;
  stream_course: string;
  roadmap_json: any;
}

export default function Roadmaps() {
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('stream_course');

      if (error) throw error;

      if (!data || data.length === 0) {
        await createSampleRoadmaps();
        return;
      }

      setRoadmaps(data);
      if (data.length > 0) {
        setSelectedStream(data[0].stream_course);
      }
    } catch (error: any) {
      toast({
        title: "Error loading roadmaps",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleRoadmaps = async () => {
    const sampleRoadmaps = [
      {
        stream_course: "MPC",
        roadmap_json: {
          higher_studies: [
            "B.Tech (Engineering)",
            "B.Sc (Physics/Chemistry/Maths)",
            "B.Arch (Architecture)",
            "Integrated M.Sc Programs"
          ],
          government_jobs: [
            "ISRO Scientist",
            "BARC Scientist",
            "Railway Engineering Services",
            "State PSU Technical Posts",
            "UPSC Engineering Services"
          ],
          private_sector: [
            "Software Engineer",
            "Mechanical Engineer",
            "Civil Engineer",
            "Data Scientist",
            "Product Manager"
          ],
          entrepreneurship: [
            "Tech Startup",
            "Engineering Consultancy",
            "Manufacturing Business",
            "EdTech Platform"
          ],
          competitive_exams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "State CETs"]
        }
      },
      {
        stream_course: "BiPC",
        roadmap_json: {
          higher_studies: [
            "MBBS (Medicine)",
            "BDS (Dental)",
            "BAMS (Ayurveda)",
            "B.Pharmacy",
            "B.Sc Nursing",
            "Veterinary Science"
          ],
          government_jobs: [
            "Medical Officer",
            "Staff Nurse",
            "Lab Technician",
            "Public Health Officer",
            "Research Scientist"
          ],
          private_sector: [
            "Hospital Doctor",
            "Pharmaceutical Industry",
            "Medical Representative",
            "Clinical Research",
            "Biotechnology"
          ],
          entrepreneurship: [
            "Private Clinic",
            "Diagnostic Center",
            "Pharmaceutical Business",
            "Health Tech Startup"
          ],
          competitive_exams: ["NEET UG", "NEET PG", "GPAT", "JIPMER", "AIIMS"]
        }
      },
      {
        stream_course: "Commerce",
        roadmap_json: {
          higher_studies: [
            "B.Com (Commerce)",
            "BBA (Business Administration)",
            "B.Sc Economics",
            "CA (Chartered Accountant)",
            "CS (Company Secretary)",
            "CMA (Cost Management)"
          ],
          government_jobs: [
            "Bank PO",
            "Income Tax Officer",
            "Customs Officer",
            "Audit Officer",
            "Statistical Officer"
          ],
          private_sector: [
            "Accountant",
            "Financial Analyst",
            "Business Analyst",
            "Sales Manager",
            "HR Executive"
          ],
          entrepreneurship: [
            "Trading Business",
            "Financial Services",
            "Consulting Firm",
            "E-commerce Business"
          ],
          competitive_exams: ["CA Foundation", "CS Executive", "CMA Foundation", "Banking Exams"]
        }
      },
      {
        stream_course: "Arts",
        roadmap_json: {
          higher_studies: [
            "B.A (Various subjects)",
            "B.Ed (Education)",
            "BFA (Fine Arts)",
            "B.Journalism",
            "BA LLB (Law)",
            "B.Social Work"
          ],
          government_jobs: [
            "Teacher",
            "IAS/IPS Officer",
            "Translator",
            "Museum Curator",
            "Social Worker"
          ],
          private_sector: [
            "Content Writer",
            "Journalist",
            "HR Executive",
            "Event Manager",
            "NGO Worker"
          ],
          entrepreneurship: [
            "Content Agency",
            "Event Management",
            "Art Gallery",
            "Educational Institute"
          ],
          competitive_exams: ["UPSC Civil Services", "State PSC", "NET/JRF", "B.Ed Entrance"]
        }
      },
      {
        stream_course: "B.Tech",
        roadmap_json: {
          higher_studies: [
            "M.Tech (Specialization)",
            "MBA (Management)",
            "MS (Study Abroad)",
            "PhD (Research)"
          ],
          government_jobs: [
            "ISRO Engineer",
            "DRDO Scientist",
            "Railways Technical",
            "PSU Engineer",
            "Government IT"
          ],
          private_sector: [
            "Software Developer",
            "System Engineer",
            "Project Manager",
            "Technical Consultant",
            "Product Engineer"
          ],
          entrepreneurship: [
            "Tech Startup",
            "Software Company",
            "Hardware Manufacturing",
            "Consulting Services"
          ],
          competitive_exams: ["GATE", "CAT", "GRE", "UPSC ESE"]
        }
      }
    ];

    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .insert(sampleRoadmaps)
        .select();

      if (error) throw error;
      setRoadmaps(data);
      if (data.length > 0) {
        setSelectedStream(data[0].stream_course);
      }
    } catch (error: any) {
      toast({
        title: "Error creating sample data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedRoadmap = roadmaps.find(r => r.stream_course === selectedStream);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Career Roadmaps</h1>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {roadmaps.length} Pathways
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stream Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Stream/Course</CardTitle>
                <CardDescription>Choose to view career pathway</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {roadmaps.map((roadmap) => (
                  <Button
                    key={roadmap.id}
                    variant={selectedStream === roadmap.stream_course ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedStream(roadmap.stream_course)}
                  >
                    {roadmap.stream_course}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Content */}
          <div className="lg:col-span-3">
            {selectedRoadmap ? (
              <div className="space-y-6">
                {/* Header */}
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {selectedRoadmap.stream_course} Career Roadmap
                    </CardTitle>
                    <CardDescription>
                      Explore all the pathways and opportunities available after {selectedRoadmap.stream_course}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Career Paths */}
                <div className="grid gap-6">
                  {/* Higher Studies */}
                  {selectedRoadmap.roadmap_json.higher_studies && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          Higher Studies
                        </CardTitle>
                        <CardDescription>Continue your academic journey</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRoadmap.roadmap_json.higher_studies.map((study, index) => (
                            <div key={index} className="flex items-center p-3 rounded-lg border bg-muted/30">
                              <ArrowDown className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                              <span className="text-sm">{study}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Government Jobs */}
                  {selectedRoadmap.roadmap_json.government_jobs && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building className="h-5 w-5 text-secondary" />
                          Government Jobs
                        </CardTitle>
                        <CardDescription>Secure positions in public sector</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRoadmap.roadmap_json.government_jobs.map((job, index) => (
                            <div key={index} className="flex items-center p-3 rounded-lg border bg-secondary/10">
                              <ArrowDown className="h-4 w-4 text-secondary mr-3 flex-shrink-0" />
                              <span className="text-sm">{job}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Private Sector */}
                  {selectedRoadmap.roadmap_json.private_sector && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Briefcase className="h-5 w-5 text-accent" />
                          Private Sector
                        </CardTitle>
                        <CardDescription>Corporate and industry opportunities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRoadmap.roadmap_json.private_sector.map((job, index) => (
                            <div key={index} className="flex items-center p-3 rounded-lg border bg-accent/10">
                              <ArrowDown className="h-4 w-4 text-accent mr-3 flex-shrink-0" />
                              <span className="text-sm">{job}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Entrepreneurship */}
                  {selectedRoadmap.roadmap_json.entrepreneurship && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Lightbulb className="h-5 w-5 text-orange-500" />
                          Entrepreneurship
                        </CardTitle>
                        <CardDescription>Start your own business venture</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRoadmap.roadmap_json.entrepreneurship.map((business, index) => (
                            <div key={index} className="flex items-center p-3 rounded-lg border bg-orange-50">
                              <ArrowDown className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                              <span className="text-sm">{business}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Competitive Exams */}
                  {selectedRoadmap.roadmap_json.competitive_exams && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Key Competitive Exams</CardTitle>
                        <CardDescription>Important exams to prepare for</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoadmap.roadmap_json.competitive_exams.map((exam, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a stream to view its career roadmap</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}