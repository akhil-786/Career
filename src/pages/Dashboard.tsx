import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  GraduationCap, 
  TrendingUp, 
  MapPin, 
  Clock,
  Award,
  Target,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  class_completed: string;
  stream?: string;
  district: string;
  language: string;
}

interface QuizResult {
  id: string;
  result_stream: string;
  confidence_score: number;
  suggested_courses: any;
  created_at: string;
}

interface SavedItem {
  id: string;
  type: string;
  data: any;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user?.id,
            name: user?.user_metadata?.name || '',
            class_completed: user?.user_metadata?.class_completed || '',
            stream: user?.user_metadata?.stream || '',
            district: user?.user_metadata?.district || '',
            language: user?.user_metadata?.language || 'en'
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
      }

      // Fetch quiz results
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (quizError) throw quizError;
      setQuizResults(quizData || []);

    } catch (error: any) {
      toast({
        title: "Error loading data",
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

  const latestQuizResult = quizResults[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Career View
            </h1>
            {profile && (
              <div className="text-sm text-muted-foreground">
                Welcome back, {profile.name}!
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile?.district}
            </Badge>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/quiz">
                <CardContent className="p-6 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Take Quiz</h3>
                  <p className="text-sm text-muted-foreground">Discover your career path</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/colleges">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <h3 className="font-semibold">Explore Colleges</h3>
                  <p className="text-sm text-muted-foreground">Find nearby institutions</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/roadmaps">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h3 className="font-semibold">Career Roadmaps</h3>
                  <p className="text-sm text-muted-foreground">Visualize your future</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/notifications">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <h3 className="font-semibold">Important Dates</h3>
                  <p className="text-sm text-muted-foreground">Admissions & deadlines</p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quiz-results">Quiz Results</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latest Quiz Result */}
                {latestQuizResult ? (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">Latest Assessment</CardTitle>
                      <Award className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Recommended Stream</span>
                          <Badge variant="secondary">{latestQuizResult.result_stream}</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Confidence Score</span>
                            <span>{latestQuizResult.confidence_score}%</span>
                          </div>
                          <Progress value={latestQuizResult.confidence_score} className="h-2" />
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full">
                        <Link to="/quiz">
                          Retake Assessment <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Get Started</CardTitle>
                      <CardDescription>Take your first career assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Discover your ideal career path with our personalized quiz
                        </p>
                        <Button asChild>
                          <Link to="/quiz">
                            Start Assessment <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Profile Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Education Level</span>
                        <Badge variant="outline">{profile?.class_completed}</Badge>
                      </div>
                      {profile?.stream && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Stream</span>
                          <Badge variant="outline">{profile.stream}</Badge>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm">{profile?.district}</span>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/profile">
                        Edit Profile <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quiz-results" className="space-y-6">
              {quizResults.length > 0 ? (
                <div className="grid gap-4">
                  {quizResults.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{result.result_stream}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">{result.confidence_score}% match</Badge>
                        </div>
                        <Progress value={result.confidence_score} className="mb-4" />
                        {result.suggested_courses && result.suggested_courses.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Suggested Courses</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.suggested_courses.slice(0, 3).map((course, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {course}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No quiz results yet</p>
                    <Button asChild>
                      <Link to="/quiz">Take Your First Quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No saved items yet</p>
                  <p className="text-sm text-muted-foreground">
                    Save colleges, courses, and career paths as you explore
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-sm text-muted-foreground">{profile?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Class Completed</label>
                      <p className="text-sm text-muted-foreground">{profile?.class_completed}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">District</label>
                      <p className="text-sm text-muted-foreground">{profile?.district}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}