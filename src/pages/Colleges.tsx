import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Phone, 
  Mail, 
  Globe,
  Heart,
  Filter,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";

interface College {
  id: string;
  name: string;
  district: string;
  programs: any;
  facilities: any;
  contact: any;
  eligibility: string;
}

export default function Colleges() {
  const { toast } = useToast();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [savedColleges, setSavedColleges] = useState<string[]>([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [searchTerm, selectedDistrict, selectedProgram, colleges]);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Create sample colleges if none exist
        await createSampleColleges();
        return;
      }

      setColleges(data);
      setFilteredColleges(data);
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

  const createSampleColleges = async () => {
    const sampleColleges = [
      {
        name: "Government Degree College Srinagar",
        district: "Srinagar",
        programs: ["B.A", "B.Sc", "B.Com", "M.A", "M.Sc"],
        facilities: ["Library", "Computer Lab", "Sports Complex", "Hostel", "Canteen"],
        contact: {
          phone: "+91-194-2123456",
          email: "gdc.srinagar@gov.jk.in",
          website: "www.gdcsrinagar.edu.in"
        },
        eligibility: "10+2 with minimum 50% marks"
      },
      {
        name: "Government Polytechnic Baramulla",
        district: "Baramulla",
        programs: ["Diploma in Civil Engineering", "Diploma in Mechanical Engineering", "Diploma in Computer Science"],
        facilities: ["Workshops", "Computer Lab", "Library", "Playground"],
        contact: {
          phone: "+91-194-2234567",
          email: "polytechnic.baramulla@gov.jk.in"
        },
        eligibility: "10th class pass with Science and Maths"
      },
      {
        name: "Kashmir University College",
        district: "Srinagar",
        programs: ["B.Tech", "BBA", "B.Sc IT", "MBA"],
        facilities: ["Modern Labs", "Library", "Wi-Fi Campus", "Placement Cell", "Hostels"],
        contact: {
          phone: "+91-194-2345678",
          email: "info@kucollege.edu.in",
          website: "www.kucollege.edu.in"
        },
        eligibility: "12th with relevant subjects"
      },
      {
        name: "Women's College Baramulla",
        district: "Baramulla",
        programs: ["B.A", "B.Sc", "B.Com", "BCA", "M.A"],
        facilities: ["Girls Hostel", "Library", "Computer Lab", "Sports Facilities"],
        contact: {
          phone: "+91-194-2456789",
          email: "womens.college.baramulla@edu.in"
        },
        eligibility: "10+2 pass (Women only)"
      },
      {
        name: "Government Medical College Srinagar",
        district: "Srinagar",
        programs: ["MBBS", "MD", "MS", "Nursing"],
        facilities: ["Hospital", "Medical Labs", "Library", "Research Center"],
        contact: {
          phone: "+91-194-2567890",
          email: "gmc.srinagar@gov.jk.in",
          website: "www.gmcsrinagar.edu.in"
        },
        eligibility: "12th with PCB and NEET qualification"
      }
    ];

    try {
      const { data, error } = await supabase
        .from('colleges')
        .insert(sampleColleges)
        .select();

      if (error) throw error;
      setColleges(data);
      setFilteredColleges(data);
    } catch (error: any) {
      toast({
        title: "Error creating sample data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filterColleges = () => {
    let filtered = colleges;

    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(college => college.district === selectedDistrict);
    }

    if (selectedProgram) {
      filtered = filtered.filter(college =>
        Array.isArray(college.programs) && 
        college.programs.some((program: string) => 
          program.toLowerCase().includes(selectedProgram.toLowerCase())
        )
      );
    }

    setFilteredColleges(filtered);
  };

  const toggleSaveCollege = (collegeId: string) => {
    setSavedColleges(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : [...prev, collegeId]
    );
    
    toast({
      title: savedColleges.includes(collegeId) ? "Removed from saved" : "Added to saved",
      description: "College saved to your profile",
    });
  };

  const getUniqueDistricts = () => {
    return [...new Set(colleges.map(college => college.district))];
  };

  const getUniquePrograms = () => {
    const allPrograms = colleges.flatMap(college => 
      Array.isArray(college.programs) ? college.programs : []
    );
    return [...new Set(allPrograms)];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <h1 className="text-xl font-bold">College Directory</h1>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {filteredColleges.length} Colleges
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Colleges
            </CardTitle>
            <CardDescription>
              Find the perfect college for your career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Districts</SelectItem>
                  {getUniqueDistricts().map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Programs</SelectItem>
                  {getUniquePrograms().map(program => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Colleges Grid */}
        <div className="grid gap-6">
          {filteredColleges.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No colleges found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{college.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {college.district}
                      </div>
                      <CardDescription>{college.eligibility}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveCollege(college.id)}
                        className={savedColleges.includes(college.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${savedColleges.includes(college.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="programs" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="programs">Programs</TabsTrigger>
                      <TabsTrigger value="facilities">Facilities</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="programs" className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(college.programs) && college.programs.map((program: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="facilities" className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(college.facilities) && college.facilities.map((facility: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="space-y-2">
                      {college.contact && (
                        <div className="space-y-2 text-sm">
                          {college.contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{college.contact.phone}</span>
                            </div>
                          )}
                          {college.contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{college.contact.email}</span>
                            </div>
                          )}
                          {college.contact.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a href={`https://${college.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {college.contact.website}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}