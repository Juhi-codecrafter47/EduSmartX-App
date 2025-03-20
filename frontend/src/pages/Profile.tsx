
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  School, 
  Book, 
  Award, 
  Clock, 
  Edit, 
  Save,
  BookOpen,
  FileText,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+91 9876543210',
    address: 'New Delhi, India',
    dob: '15/08/2004',
    school: 'Delhi Public School',
    grade: '12th Grade',
    examPrep: 'JEE Advanced',
    joinedDate: 'June 2023'
  });
  
  const [tempUserData, setTempUserData] = useState({...userData});
  
  const progressData = [
    { subject: 'Physics', progress: 78, color: 'bg-blue-500' },
    { subject: 'Chemistry', progress: 65, color: 'bg-green-500' },
    { subject: 'Mathematics', progress: 82, color: 'bg-purple-500' }
  ];
  
  const recentActivities = [
    { 
      id: 1,
      type: 'quiz',
      title: 'Physics Quiz: Mechanics',
      date: '2 days ago',
      score: '8/10',
      icon: <FileText className="h-5 w-5 text-orange-500" />
    },
    { 
      id: 2,
      type: 'syllabus',
      title: 'Completed Chemistry: Chemical Bonding',
      date: '3 days ago',
      icon: <BookOpen className="h-5 w-5 text-green-500" />
    },
    { 
      id: 3,
      type: 'question',
      title: 'Solved JEE 2022 Question Paper',
      date: '1 week ago',
      score: '85%',
      icon: <FileText className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 4,
      type: 'syllabus',
      title: 'Completed Physics: Kinematics',
      date: '1 week ago',
      icon: <BookOpen className="h-5 w-5 text-green-500" />
    },
    { 
      id: 5,
      type: 'quiz',
      title: 'Mathematics Quiz: Calculus',
      date: '2 weeks ago',
      score: '9/10',
      icon: <FileText className="h-5 w-5 text-orange-500" />
    }
  ];
  
  const achievements = [
    {
      id: 1,
      title: 'Perfect Score',
      description: 'Achieved 100% in Mathematics Quiz',
      date: 'Aug 12, 2023',
      icon: <Award className="h-8 w-8 text-yellow-500" />
    },
    {
      id: 2,
      title: 'Consistent Learner',
      description: '30 day streak of daily learning',
      date: 'July 15, 2023',
      icon: <Clock className="h-8 w-8 text-blue-500" />
    },
    {
      id: 3,
      title: 'Subject Master',
      description: 'Completed all Physics chapters',
      date: 'June 28, 2023',
      icon: <CheckCircle className="h-8 w-8 text-green-500" />
    }
  ];
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData({...tempUserData});
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } else {
      // Start editing
      setTempUserData({...userData});
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUserData({
      ...tempUserData,
      [name]: value
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile and view your progress</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="text-center pb-2">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary mb-4">
                    <User size={48} />
                  </div>
                  <CardTitle>{userData.name}</CardTitle>
                  <CardDescription>{userData.examPrep} Student</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{userData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{userData.dob}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">School</p>
                        <p className="font-medium">{userData.school}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Book className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="font-medium">{userData.grade}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleEditToggle} className="w-full">
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subject Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {progressData.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                          <Input 
                            id="name"
                            name="name"
                            value={tempUserData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input 
                            id="email"
                            name="email"
                            value={tempUserData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={tempUserData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium">Location</label>
                          <Input 
                            id="address"
                            name="address"
                            value={tempUserData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="dob" className="text-sm font-medium">Date of Birth</label>
                          <Input 
                            id="dob"
                            name="dob"
                            value={tempUserData.dob}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="school" className="text-sm font-medium">School</label>
                          <Input 
                            id="school"
                            name="school"
                            value={tempUserData.school}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="grade" className="text-sm font-medium">Grade</label>
                          <Input 
                            id="grade"
                            name="grade"
                            value={tempUserData.grade}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="examPrep" className="text-sm font-medium">Exam Preparation</label>
                          <Input 
                            id="examPrep"
                            name="examPrep"
                            value={tempUserData.examPrep}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="activity">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest learning activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                {activity.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  {activity.type === 'quiz' && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                                      Quiz
                                    </Badge>
                                  )}
                                  {activity.type === 'syllabus' && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                      Syllabus
                                    </Badge>
                                  )}
                                  {activity.type === 'question' && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                      Question Paper
                                    </Badge>
                                  )}
                                  {activity.score && (
                                    <Badge variant="outline">
                                      Score: {activity.score}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Achievements</CardTitle>
                        <CardDescription>Badges and milestones you've earned</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {achievements.map((achievement) => (
                            <Card key={achievement.id} className="overflow-hidden">
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    {achievement.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{achievement.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {achievement.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Earned on {achievement.date}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Your test and quiz performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Performance Charts</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                        Detailed analytics will appear here as you complete more quizzes and tests
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
