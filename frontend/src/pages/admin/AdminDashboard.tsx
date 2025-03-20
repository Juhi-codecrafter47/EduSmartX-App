
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Search, 
  Filter, 
  BarChart2, 
  PieChart, 
  Users, 
  BookOpen, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  Home,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExam, setFilteredExam] = useState<string>('all');
  const [filteredAccuracy, setFilteredAccuracy] = useState<string>('all');
  
  const students = [
    {
      id: 1,
      name: 'Arjun Sharma',
      email: 'arjun.sharma@example.com',
      exam: 'JEE',
      progress: 78,
      accuracyPhysics: 82,
      accuracyChemistry: 75,
      accuracyMathematics: 80,
      quizLevel: 'Hard',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Priya Mehta',
      email: 'priya.mehta@example.com',
      exam: 'NEET',
      progress: 65,
      accuracyPhysics: 70,
      accuracyChemistry: 68,
      accuracyBiology: 85,
      quizLevel: 'Medium',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      exam: 'JEE',
      progress: 42,
      accuracyPhysics: 45,
      accuracyChemistry: 52,
      accuracyMathematics: 38,
      quizLevel: 'Easy',
      lastActive: '5 hours ago',
    },
    {
      id: 4,
      name: 'Ananya Singh',
      email: 'ananya.singh@example.com',
      exam: 'NEET',
      progress: 88,
      accuracyPhysics: 92,
      accuracyChemistry: 84,
      accuracyBiology: 90,
      quizLevel: 'Hard',
      lastActive: '3 hours ago',
    },
    {
      id: 5,
      name: 'Vikram Patel',
      email: 'vikram.patel@example.com',
      exam: 'JEE',
      progress: 70,
      accuracyPhysics: 65,
      accuracyChemistry: 72,
      accuracyMathematics: 75,
      quizLevel: 'Medium',
      lastActive: '2 days ago',
    },
    {
      id: 6,
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      exam: 'NEET',
      progress: 54,
      accuracyPhysics: 60,
      accuracyChemistry: 58,
      accuracyBiology: 62,
      quizLevel: 'Medium',
      lastActive: '1 hour ago',
    },
    {
      id: 7,
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      exam: 'JEE',
      progress: 35,
      accuracyPhysics: 40,
      accuracyChemistry: 32,
      accuracyMathematics: 45,
      quizLevel: 'Easy',
      lastActive: '4 hours ago',
    },
  ];
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExam = filteredExam === 'all' || student.exam === filteredExam;
    
    let accuracyAvg;
    if (student.exam === 'JEE') {
      accuracyAvg = (student.accuracyPhysics + student.accuracyChemistry + student.accuracyMathematics) / 3;
    } else {
      accuracyAvg = (student.accuracyPhysics + student.accuracyChemistry + student.accuracyBiology) / 3;
    }
    
    let matchesAccuracy = true;
    if (filteredAccuracy === 'high') {
      matchesAccuracy = accuracyAvg >= 80;
    } else if (filteredAccuracy === 'medium') {
      matchesAccuracy = accuracyAvg >= 60 && accuracyAvg < 80;
    } else if (filteredAccuracy === 'low') {
      matchesAccuracy = accuracyAvg < 60;
    }
    
    return matchesSearch && matchesExam && matchesAccuracy;
  });
  
  const getQuizLevelColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Hard':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-border/40 transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border/40">
          <Link to="/admin/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              E
            </span>
            <span>EduPrep Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary"
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/students" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <Users size={18} />
            <span>Students</span>
          </Link>
          
          <Link 
            to="/admin/syllabus" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <BookOpen size={18} />
            <span>Syllabus Management</span>
          </Link>
          
          <Link 
            to="/admin/papers" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <FileText size={18} />
            <span>Question Papers</span>
          </Link>

          <Link 
            to="/admin/papers" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <FileText size={18} />
            <span>Question Management</span>
          </Link>
          
          <Link 
            to="/admin/settings" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border/40">
          <Link 
            to="/login" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <header className="sticky top-0 z-40 bg-white border-b border-border/40 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              className="p-2 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                  <span className="font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage students and track their progress</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Students</div>
                      <div className="text-2xl font-bold">1,245</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-green-500 flex items-center">
                      <ArrowUpRight size={16} className="mr-1" />
                      <span>12% increase</span>
                    </div>
                    <div className="text-muted-foreground">vs last month</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Active Courses</div>
                      <div className="text-2xl font-bold">35</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-green-500 flex items-center">
                      <ArrowUpRight size={16} className="mr-1" />
                      <span>5% increase</span>
                    </div>
                    <div className="text-muted-foreground">vs last month</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg. Completion</div>
                      <div className="text-2xl font-bold">68%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-green-500 flex items-center">
                      <ArrowUpRight size={16} className="mr-1" />
                      <span>8% increase</span>
                    </div>
                    <div className="text-muted-foreground">vs last month</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                      <BarChart2 size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg. Accuracy</div>
                      <div className="text-2xl font-bold">72%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-green-500 flex items-center">
                      <ArrowUpRight size={16} className="mr-1" />
                      <span>3% increase</span>
                    </div>
                    <div className="text-muted-foreground">vs last month</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="jee" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jee">JEE Students</TabsTrigger>
                <TabsTrigger value="neet">NEET Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="jee" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>JEE Student Management</CardTitle>
                    <CardDescription>View and manage JEE students and their progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or email..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={filteredExam} onValueChange={setFilteredExam}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Exams</SelectItem>
                            <SelectItem value="JEE">JEE</SelectItem>
                            <SelectItem value="NEET">NEET</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={filteredAccuracy} onValueChange={setFilteredAccuracy}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Accuracy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Accuracy</SelectItem>
                            <SelectItem value="high">High (80%+)</SelectItem>
                            <SelectItem value="medium">Medium (60-80%)</SelectItem>
                            <SelectItem value="low">Low (Below 60%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Physics</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Chemistry</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Mathematics</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quiz Level</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents
                            .filter(student => student.exam === 'JEE')
                            .map((student) => (
                              <tr key={student.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      {student.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{student.name}</div>
                                      <div className="text-sm text-muted-foreground">{student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                                      <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm">{student.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyPhysics >= 80 ? "text-green-600" :
                                    student.accuracyPhysics >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyPhysics}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyChemistry >= 80 ? "text-green-600" :
                                    student.accuracyChemistry >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyChemistry}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyMathematics >= 80 ? "text-green-600" :
                                    student.accuracyMathematics >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyMathematics}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge className={getQuizLevelColor(student.quizLevel)}>
                                    {student.quizLevel}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-muted-foreground">{student.lastActive}</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Button variant="outline" size="sm">View Details</Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="neet" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>NEET Student Management</CardTitle>
                    <CardDescription>View and manage NEET students and their progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or email..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={filteredExam} onValueChange={setFilteredExam}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Exams</SelectItem>
                            <SelectItem value="JEE">JEE</SelectItem>
                            <SelectItem value="NEET">NEET</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={filteredAccuracy} onValueChange={setFilteredAccuracy}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Accuracy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Accuracy</SelectItem>
                            <SelectItem value="high">High (80%+)</SelectItem>
                            <SelectItem value="medium">Medium (60-80%)</SelectItem>
                            <SelectItem value="low">Low (Below 60%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Physics</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Chemistry</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Biology</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quiz Level</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents
                            .filter(student => student.exam === 'NEET')
                            .map((student) => (
                              <tr key={student.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      {student.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{student.name}</div>
                                      <div className="text-sm text-muted-foreground">{student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                                      <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm">{student.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyPhysics >= 80 ? "text-green-600" :
                                    student.accuracyPhysics >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyPhysics}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyChemistry >= 80 ? "text-green-600" :
                                    student.accuracyChemistry >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyChemistry}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    student.accuracyBiology >= 80 ? "text-green-600" :
                                    student.accuracyBiology >= 60 ? "text-yellow-600" :
                                    "text-red-600"
                                  )}>
                                    {student.accuracyBiology}%
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge className={getQuizLevelColor(student.quizLevel)}>
                                    {student.quizLevel}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-muted-foreground">{student.lastActive}</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Button variant="outline" size="sm">View Details</Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
