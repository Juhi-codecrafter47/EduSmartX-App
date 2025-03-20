
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText, HelpCircle, Timer, Award, Zap, BookOpen, TrendingUp, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/ui/ProgressCircle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Dashboard = () => {
  const [selectedExam, setSelectedExam] = useState<'JEE' | 'NEET'>('JEE');
  
  // Dashboard statistics
  const stats = {
    JEE: {
      totalProgress: 65,
      physics: 75,
      chemistry: 60,
      mathematics: 50,
      quizzesTaken: 48,
      questionsAnswered: 320,
      avgAccuracy: 78,
      streak: 15,
    },
    NEET: {
      totalProgress: 58,
      physics: 65,
      chemistry: 70,
      biology: 45,
      quizzesTaken: 42,
      questionsAnswered: 290,
      avgAccuracy: 72,
      streak: 12,
    }
  };
  
  // Get data based on selected exam
  const currentStats = selectedExam === 'JEE' ? stats.JEE : stats.NEET;
  
  // Generate recent activity data
  const recentActivity = [
    {
      type: 'Quiz Completed',
      title: `${selectedExam} ${selectedExam === 'JEE' ? 'Physics' : 'Biology'} - Mechanics`,
      score: '85%',
      time: '2 hours ago',
    },
    {
      type: 'Syllabus Update',
      title: `Completed ${selectedExam === 'JEE' ? 'Calculus' : 'Cell Biology'} section`,
      score: null,
      time: '5 hours ago',
    },
    {
      type: 'Practice Test',
      title: `${selectedExam} Full Paper Simulation`,
      score: '72%',
      time: '1 day ago',
    },
    {
      type: 'Chatbot Session',
      title: 'Asked 5 questions on Thermodynamics',
      score: null,
      time: '2 days ago',
    },
  ];
  
  // Generate leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Arjun S.', score: 9850, avatar: '👨‍🎓' },
    { rank: 2, name: 'Priya M.', score: 9720, avatar: '👩‍🎓' },
    { rank: 3, name: 'Rahul K.', score: 9580, avatar: '👨‍🎓' },
    { rank: 4, name: 'Neha P.', score: 9490, avatar: '👩‍🎓' },
    { rank: 5, name: 'Vikram S.', score: 9350, avatar: '👨‍🎓' },
  ];
  
  // Helper function to get the subject-specific value
  const getSubjectValue = (jeeValue: number, neetValue: number) => {
    return selectedExam === 'JEE' ? jeeValue : neetValue;
  };
  
  // Helper function to get the third subject name and value
  const getThirdSubject = () => {
    return {
      name: selectedExam === 'JEE' ? 'Mathematics' : 'Biology',
      value: selectedExam === 'JEE' ? stats.JEE.mathematics : stats.NEET.biology
    };
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Student</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your preparation progress</p>
          </div>
          
          <div className="flex items-center bg-secondary rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setSelectedExam('JEE')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedExam === 'JEE'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              JEE
            </button>
            <button
              onClick={() => setSelectedExam('NEET')}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedExam === 'NEET'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              NEET
            </button>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Track your overall syllabus completion for {selectedExam}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center">
                  <ProgressCircle value={currentStats.totalProgress} size={160} color="#0A84FF">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-semibold">{currentStats.totalProgress}%</span>
                      <span className="text-sm text-muted-foreground">Overall</span>
                    </div>
                  </ProgressCircle>
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div className="flex flex-col items-center">
                    <ProgressCircle value={currentStats.physics} size={100} color="#34C759">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">{currentStats.physics}%</span>
                      </div>
                    </ProgressCircle>
                    <span className="mt-2 font-medium">Physics</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <ProgressCircle value={currentStats.chemistry} size={100} color="#FF9500">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">{currentStats.chemistry}%</span>
                      </div>
                    </ProgressCircle>
                    <span className="mt-2 font-medium">Chemistry</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <ProgressCircle 
                      value={getThirdSubject().value} 
                      size={100} 
                      color="#AF52DE"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">
                          {getThirdSubject().value}%
                        </span>
                      </div>
                    </ProgressCircle>
                    <span className="mt-2 font-medium">{getThirdSubject().name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border/40 bg-muted/20">
              <Button variant="outline" asChild>
                <Link to="/syllabus">View Full Syllabus</Link>
              </Button>
              <Button asChild>
                <Link to="/quiz">Start a Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats & Achievements</CardTitle>
              <CardDescription>
                Your learning activity and streaks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <FileText size={20} />
                  </div>
                  <span className="text-2xl font-semibold">{currentStats.quizzesTaken}</span>
                  <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                </div>
                
                <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <HelpCircle size={20} />
                  </div>
                  <span className="text-2xl font-semibold">{currentStats.questionsAnswered}</span>
                  <span className="text-sm text-muted-foreground">Questions Answered</span>
                </div>
              </div>
              
              {/* <div className="bg-secondary/50 p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55]">
                  <Zap size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">Daily Streak</span>
                    <span className="text-2xl font-semibold">{currentStats.streak} days</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF2D55] transition-all duration-500 ease-out"
                      style={{ width: `${(currentStats.streak / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">30 days goal</p>
                </div>
              </div>
               */}
              <div className="bg-secondary/50 p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                  <Award size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">Accuracy</span>
                    <span className="text-2xl font-semibold">{currentStats.avgAccuracy}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#34C759] transition-all duration-500 ease-out"
                      style={{ width: `${currentStats.avgAccuracy}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Overall accuracy in quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Access Tabs */}
          <div className="col-span-1 md:col-span-2">
            <Tabs defaultValue="syllabus" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-6">
                <TabsTrigger value="syllabus" className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Syllabus</span>
                </TabsTrigger>
                <TabsTrigger value="papers" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Papers</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center">
                  <Timer className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Quiz</span>
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Help</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="syllabus" className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{selectedExam} Syllabus</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-[#34C759]/10 flex items-center justify-center text-[#34C759] mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Physics</h4>
                      <p className="text-sm text-muted-foreground mb-4">Mechanics, Electrostatics, Optics, Thermodynamics</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#34C759] transition-all duration-500 ease-out"
                          style={{ width: `${currentStats.physics}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{currentStats.physics}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500] mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Chemistry</h4>
                      <p className="text-sm text-muted-foreground mb-4">Organic, Inorganic, Physical Chemistry</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF9500] transition-all duration-500 ease-out"
                          style={{ width: `${currentStats.chemistry}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{currentStats.chemistry}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-[#AF52DE]/10 flex items-center justify-center text-[#AF52DE] mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">{getThirdSubject().name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedExam === 'JEE' 
                          ? 'Algebra, Calculus, Trigonometry, Statistics' 
                          : 'Zoology, Botany, Human Physiology'}
                      </p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#AF52DE] transition-all duration-500 ease-out"
                          style={{ width: `${getThirdSubject().value}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{getThirdSubject().value}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button asChild>
                    <Link to="/syllabus">View Complete Syllabus</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="papers" className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Practice Papers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FileText size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Paper 1</h4>
                      <p className="text-sm text-muted-foreground mb-4">Basic concepts & fundamentals</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Timer className="h-4 w-4 mr-1" />
                          <span>3 hours</span>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FileText size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Paper 2</h4>
                      <p className="text-sm text-muted-foreground mb-4">Intermediate difficulty questions</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Timer className="h-4 w-4 mr-1" />
                          <span>3 hours</span>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FileText size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Paper 3</h4>
                      <p className="text-sm text-muted-foreground mb-4">Advanced concepts & problems</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Timer className="h-4 w-4 mr-1" />
                          <span>3 hours</span>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button asChild>
                    <Link to="/question-papers">View All Papers</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Personalized Quiz</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-[#5856D6]/10 flex items-center justify-center text-[#5856D6] mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Topic-wise Quiz</h4>
                      <p className="text-sm text-muted-foreground mb-4">Master one topic at a time</p>
                      <Button className="w-full" asChild>
                        <Link to="/quiz">Take a Topic Quiz</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55] mb-4">
                        <TrendingUp size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Full {selectedExam} Quiz</h4>
                      <p className="text-sm text-muted-foreground mb-4">Test yourself with a complete exam simulation</p>
                      <Button className="w-full" asChild>
                        <Link to="/quiz">Take a Full Quiz</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="chatbot" className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">AI Study Assistant</h3>
                
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <HelpCircle size={32} />
                      </div>
                      <h4 className="font-semibold text-lg">Need help with a question?</h4>
                      <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        Our AI assistant can help you solve difficult problems, explain concepts, and provide study resources.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Button className="mb-4" asChild>
                        <Link to="/chatbot">Ask a Question</Link>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        You can also upload an image of a question you're stuck on
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Leaderboard Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>
                  Top performers this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((item) => (
                    <div 
                      key={item.rank} 
                      className={`flex items-center p-3 rounded-lg ${
                        item.rank === 1 
                          ? 'bg-[#FFD700]/10 border border-[#FFD700]/30' 
                          : item.rank === 2 
                            ? 'bg-[#C0C0C0]/10 border border-[#C0C0C0]/30'
                            : item.rank === 3
                              ? 'bg-[#CD7F32]/10 border border-[#CD7F32]/30'
                              : 'bg-secondary/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        item.rank === 1 
                          ? 'bg-[#FFD700]' 
                          : item.rank === 2 
                            ? 'bg-[#C0C0C0]'
                            : item.rank === 3
                              ? 'bg-[#CD7F32]'
                              : 'bg-muted-foreground'
                      }`}>
                        {item.rank}
                      </div>
                      <div className="ml-3 text-2xl">{item.avatar}</div>
                      <div className="ml-3 flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.score.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="#">View Full Leaderboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-border"></div>
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pl-10 relative">
                    <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-secondary/50 rounded-lg p-4">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.type} • {activity.time}
                        </div>
                      </div>
                      {activity.score && (
                        <div className="mt-2 md:mt-0 md:ml-4 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                          Score: {activity.score}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
