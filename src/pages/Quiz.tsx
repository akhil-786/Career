import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface QuizQuestion {
  id: string;
  question_text: string;
  options: any;
  mapping: any;
  class_level: string;
}

interface QuizAnswer {
  questionId: string;
  selectedOption: string;
  mappedValue: string;
}

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfileAndQuestions();
    }
  }, [user]);

  const fetchUserProfileAndQuestions = async () => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('class_completed')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setUserProfile(profile);
      const classLevel = profile?.class_completed || '10th';

      // Fetch questions based on class level
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('class_level', classLevel)
        .limit(10);

      if (questionsError) throw questionsError;
      
      if (!questionsData || questionsData.length === 0) {
        // Create default questions if none exist
        await createDefaultQuestions(classLevel);
        return;
      }

      setQuestions(questionsData);
    } catch (error: any) {
      toast({
        title: "Error loading quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultQuestions = async (classLevel: string) => {
    const defaultQuestions = classLevel === '10th' ? [
      {
        question_text: "Which subject do you enjoy the most?",
        options: ["Mathematics", "Science", "Languages", "Arts", "Social Studies"],
        mapping: {
          "Mathematics": "mpc",
          "Science": "bipc",
          "Languages": "arts",
          "Arts": "arts",
          "Social Studies": "commerce"
        },
        class_level: "10th"
      },
      {
        question_text: "What type of activities do you prefer?",
        options: ["Problem solving", "Experiments", "Creative writing", "Drawing/Painting", "Business activities"],
        mapping: {
          "Problem solving": "mpc",
          "Experiments": "bipc",
          "Creative writing": "arts",
          "Drawing/Painting": "arts",
          "Business activities": "commerce"
        },
        class_level: "10th"
      },
      {
        question_text: "Which career field attracts you most?",
        options: ["Engineering", "Medicine", "Teaching", "Arts & Design", "Business"],
        mapping: {
          "Engineering": "mpc",
          "Medicine": "bipc",
          "Teaching": "arts",
          "Arts & Design": "arts",
          "Business": "commerce"
        },
        class_level: "10th"
      }
    ] : [
      {
        question_text: "What is your preferred study approach?",
        options: ["Theoretical concepts", "Practical applications", "Research work", "Creative projects", "Business cases"],
        mapping: {
          "Theoretical concepts": "engineering",
          "Practical applications": "technology",
          "Research work": "science",
          "Creative projects": "arts",
          "Business cases": "management"
        },
        class_level: "12th"
      },
      {
        question_text: "Which work environment appeals to you?",
        options: ["Lab/Technical", "Corporate office", "Healthcare", "Educational institution", "Creative studio"],
        mapping: {
          "Lab/Technical": "engineering",
          "Corporate office": "management",
          "Healthcare": "medical",
          "Educational institution": "education",
          "Creative studio": "arts"
        },
        class_level: "12th"
      }
    ];

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert(defaultQuestions)
        .select();

      if (error) throw error;
      setQuestions(data);
    } catch (error: any) {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedOption(option);
    
    const currentQuestion = questions[currentQuestionIndex];
    const mappedValue = currentQuestion.mapping[option] || option.toLowerCase();
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOption: option,
      mappedValue: mappedValue
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...updatedAnswers, newAnswer]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // Check if there's already an answer for the next question
      const nextQuestion = questions[currentQuestionIndex + 1];
      const existingAnswer = answers.find(a => a.questionId === nextQuestion.id);
      setSelectedOption(existingAnswer?.selectedOption || "");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // Load the previous answer
      const prevQuestion = questions[currentQuestionIndex - 1];
      const existingAnswer = answers.find(a => a.questionId === prevQuestion.id);
      setSelectedOption(existingAnswer?.selectedOption || "");
    }
  };

  const calculateResults = () => {
    const streamCounts: Record<string, number> = {};
    
    answers.forEach(answer => {
      const stream = answer.mappedValue;
      streamCounts[stream] = (streamCounts[stream] || 0) + 1;
    });

    const sortedStreams = Object.entries(streamCounts)
      .sort(([,a], [,b]) => b - a);

    const topStream = sortedStreams[0];
    const confidenceScore = Math.round((topStream[1] / answers.length) * 100);

    return {
      recommendedStream: topStream[0],
      confidenceScore: confidenceScore,
      allScores: streamCounts
    };
  };

  const handleSubmit = async () => {
    if (answers.length !== questions.length) {
      toast({
        title: "Incomplete quiz",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const results = calculateResults();
      
      // Generate AI-powered suggestions using Gemini
      const aiSuggestions = await generateAISuggestions(results.recommendedStream, userProfile?.class_completed);

      const { error } = await supabase
        .from('quiz_results')
        .insert([{
          user_id: user?.id,
          result_stream: results.recommendedStream,
          confidence_score: results.confidenceScore,
          suggested_courses: aiSuggestions
        }]);

      if (error) throw error;

      toast({
        title: "Quiz completed!",
        description: "Your results have been saved",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error submitting quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateAISuggestions = async (stream: string, classLevel: string) => {
    try {
      // Call edge function for AI suggestions
      const { data, error } = await supabase.functions.invoke('generate-career-suggestions', {
        body: { stream: stream, classLevel: classLevel }
      });

      if (error) throw error;
      return data.suggestions || [];
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Return fallback suggestions
      return getFallbackSuggestions(stream);
    }
  };

  const getFallbackSuggestions = (stream: string) => {
    const fallbacks: Record<string, string[]> = {
      'mpc': ['B.Tech Computer Science', 'B.Tech Mechanical', 'B.Sc Physics'],
      'bipc': ['MBBS', 'B.Pharmacy', 'B.Sc Biology'],
      'commerce': ['B.Com', 'BBA', 'CA Foundation'],
      'arts': ['B.A English', 'B.A History', 'B.Ed'],
      'engineering': ['B.Tech', 'BE', 'Diploma Engineering'],
      'medical': ['MBBS', 'BDS', 'BHMS'],
      'management': ['BBA', 'B.Com', 'Hotel Management']
    };
    
    return fallbacks[stream] || ['General degree courses'];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No quiz questions available</p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
            <h1 className="text-xl font-bold">Career Assessment</h1>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentQuestion.question_text}
              </CardTitle>
              <CardDescription>
                Choose the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedOption} onValueChange={handleAnswerSelect}>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption || submitting}
                className="min-w-[120px]"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Answer Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Answered Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => {
                  const isAnswered = answers.some(a => a.questionId === questions[index].id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : isAnswered
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}