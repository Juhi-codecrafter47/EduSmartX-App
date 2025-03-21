import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  User,
  Mail,
  Edit,
  Save,
  FileText,
  BarChart3,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';

interface UserData {
  name: string;
  email: string;
  role: string;
  profilePic?: string;
  progress: {
    topicId: { _id: string; name: string };
    completed: boolean;
  }[];
  accuracy: {
    topicId: { _id: string; name: string };
    accuracy: number;
    totalTestsGiven: number;
  }[];
  testHistory: {
    testId: { _id: string };
    topicId: { _id: string; name: string };
    score: number;
    testDate: Date;
  }[];
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/h2c/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data);
        setTempUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing && tempUserData) {
      setUserData({ ...tempUserData });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } else if (userData) {
      setTempUserData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }) as UserData);
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

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
                    {userData.profilePic ? (
                      <img src={userData.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                  <CardTitle>{userData.name}</CardTitle>
                  <CardDescription>{userData.role} User</CardDescription>
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
                  {userData.progress.length > 0 ? (
                    userData.progress.map((progress) => (
                      <div key={progress.topicId._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{progress.topicId.name}</span>
                          <span className="text-sm text-muted-foreground">{progress.completed ? 'Completed' : 'In Progress'}</span>
                        </div>
                        <Progress value={progress.completed ? 100 : 50} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <p>No progress data available.</p>
                  )}
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
                            value={tempUserData?.name || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input
                            id="email"
                            name="email"
                            value={tempUserData?.email || ''}
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
                          {userData.testHistory.length > 0 ? (
                            userData.testHistory.map((activity) => (
                              <div key={activity.testId._id} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{activity.topicId.name}</h4>
                                    <p className="text-sm text-muted-foreground">{new Date(activity.testDate).toLocaleDateString()}</p>
                                  </div>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                                      Quiz
                                    </Badge>
                                    <Badge variant="outline">
                                      Score: {activity.score}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No recent activity available.</p>
                          )}
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
                          {userData.accuracy.length > 0 ? (
                            userData.accuracy.map((accuracy) => (
                              <Card key={accuracy.topicId._id} className="overflow-hidden">
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Award className="h-8 w-8 text-yellow-500" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{accuracy.topicId.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Accuracy: {accuracy.accuracy}%
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Tests Given: {accuracy.totalTestsGiven}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p>No achievements available.</p>
                          )}
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
