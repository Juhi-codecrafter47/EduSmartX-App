import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ChevronRight, Search, Filter, BookOpenCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

type Topic = {
  name: string;
  completed: boolean;
};

type Chapter = {
  chapter: string;
  completed: number;
  total: number;
  topics: Topic[];
};

type JEESyllabus = {
  physics: Chapter[];
  chemistry: Chapter[];
  mathematics: Chapter[];
};

type NEETSyllabus = {
  physics: Chapter[];
  chemistry: Chapter[];
  biology: Chapter[];
};

type SyllabusType = JEESyllabus | NEETSyllabus;

const Syllabus = () => {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<'JEE' | 'NEET'>('JEE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [completedAlert, setCompletedAlert] = useState<{visible: boolean, chapter: string} | null>(null);
  
  const jeeSyllabus: JEESyllabus = {
    physics: [
      {
        chapter: "Mechanics",
        completed: 4,
        total: 10,
        topics: [
          { name: "Units and Dimensions", completed: true },
          { name: "Kinematics", completed: true },
          { name: "Newton's Laws of Motion", completed: true },
          { name: "Work, Energy and Power", completed: true },
          { name: "Rotational Motion", completed: false },
          { name: "Gravitation", completed: false },
          { name: "Properties of Solids and Liquids", completed: false },
          { name: "Thermodynamics", completed: false },
          { name: "Kinetic Theory of Gases", completed: false },
          { name: "Oscillations and Waves", completed: false },
        ]
      },
      {
        chapter: "Electrodynamics",
        completed: 2,
        total: 8,
        topics: [
          { name: "Electrostatics", completed: true },
          { name: "Current Electricity", completed: true },
          { name: "Magnetic Effects of Current", completed: false },
          { name: "Magnetism", completed: false },
          { name: "Electromagnetic Induction", completed: false },
          { name: "Alternating Current", completed: false },
          { name: "Electromagnetic Waves", completed: false },
          { name: "Ray Optics", completed: false },
        ]
      },
      {
        chapter: "Modern Physics",
        completed: 1,
        total: 4,
        topics: [
          { name: "Dual Nature of Matter and Radiation", completed: true },
          { name: "Atoms and Nuclei", completed: false },
          { name: "Electronic Devices", completed: false },
          { name: "Communication Systems", completed: false },
        ]
      }
    ],
    chemistry: [
      {
        chapter: "Physical Chemistry",
        completed: 3,
        total: 8,
        topics: [
          { name: "Basic Concepts", completed: true },
          { name: "States of Matter", completed: true },
          { name: "Atomic Structure", completed: true },
          { name: "Chemical Bonding", completed: false },
          { name: "Chemical Thermodynamics", completed: false },
          { name: "Solutions", completed: false },
          { name: "Equilibrium", completed: false },
          { name: "Redox Reactions", completed: false },
        ]
      },
      {
        chapter: "Organic Chemistry",
        completed: 1,
        total: 6,
        topics: [
          { name: "Basic Principles", completed: true },
          { name: "Hydrocarbons", completed: false },
          { name: "Organic Compounds with Functional Groups", completed: false },
          { name: "Biomolecules", completed: false },
          { name: "Polymers", completed: false },
          { name: "Chemistry in Everyday Life", completed: false },
        ]
      },
      {
        chapter: "Inorganic Chemistry",
        completed: 2,
        total: 5,
        topics: [
          { name: "Classification of Elements", completed: true },
          { name: "Hydrogen and s-Block Elements", completed: true },
          { name: "p-Block Elements", completed: false },
          { name: "d and f Block Elements", completed: false },
          { name: "Coordination Compounds", completed: false },
        ]
      }
    ],
    mathematics: [
      {
        chapter: "Algebra",
        completed: 3,
        total: 7,
        topics: [
          { name: "Sets, Relations and Functions", completed: true },
          { name: "Complex Numbers", completed: true },
          { name: "Quadratic Equations", completed: true },
          { name: "Matrices and Determinants", completed: false },
          { name: "Permutations and Combinations", completed: false },
          { name: "Mathematical Induction", completed: false },
          { name: "Binomial Theorem", completed: false },
        ]
      },
      {
        chapter: "Calculus",
        completed: 2,
        total: 6,
        topics: [
          { name: "Limits and Continuity", completed: true },
          { name: "Differentiation", completed: true },
          { name: "Applications of Derivatives", completed: false },
          { name: "Indefinite Integration", completed: false },
          { name: "Definite Integration", completed: false },
          { name: "Differential Equations", completed: false },
        ]
      },
      {
        chapter: "Coordinate Geometry",
        completed: 1,
        total: 4,
        topics: [
          { name: "Straight Lines", completed: true },
          { name: "Circles", completed: false },
          { name: "Conic Sections", completed: false },
          { name: "3D Geometry", completed: false },
        ]
      }
    ]
  };
  
  const neetSyllabus: NEETSyllabus = {
    physics: [
      {
        chapter: "Mechanics",
        completed: 3,
        total: 8,
        topics: [
          { name: "Physical World and Measurement", completed: true },
          { name: "Kinematics", completed: true },
          { name: "Laws of Motion", completed: true },
          { name: "Work, Energy and Power", completed: false },
          { name: "Motion of System of Particles", completed: false },
          { name: "Gravitation", completed: false },
          { name: "Properties of Bulk Matter", completed: false },
          { name: "Thermodynamics", completed: false },
        ]
      },
      {
        chapter: "Electrodynamics",
        completed: 1,
        total: 7,
        topics: [
          { name: "Electrostatics", completed: true },
          { name: "Current Electricity", completed: false },
          { name: "Magnetic Effects of Current", completed: false },
          { name: "Magnetism", completed: false },
          { name: "Electromagnetic Induction", completed: false },
          { name: "Alternating Current", completed: false },
          { name: "Electromagnetic Waves", completed: false },
        ]
      }
    ],
    chemistry: [
      {
        chapter: "Physical Chemistry",
        completed: 2,
        total: 7,
        topics: [
          { name: "Some Basic Concepts", completed: true },
          { name: "States of Matter", completed: true },
          { name: "Atomic Structure", completed: false },
          { name: "Chemical Bonding", completed: false },
          { name: "Chemical Thermodynamics", completed: false },
          { name: "Solutions", completed: false },
          { name: "Equilibrium", completed: false },
        ]
      },
      {
        chapter: "Organic Chemistry",
        completed: 1,
        total: 5,
        topics: [
          { name: "Basic Principles", completed: true },
          { name: "Hydrocarbons", completed: false },
          { name: "Organic Compounds with Functional Groups", completed: false },
          { name: "Biomolecules", completed: false },
          { name: "Chemistry in Everyday Life", completed: false },
        ]
      }
    ],
    biology: [
      {
        chapter: "Botany",
        completed: 3,
        total: 8,
        topics: [
          { name: "Diversity in Living World", completed: true },
          { name: "Cell Structure and Function", completed: true },
          { name: "Plant Physiology", completed: true },
          { name: "Reproduction", completed: false },
          { name: "Genetics and Evolution", completed: false },
          { name: "Biology and Human Welfare", completed: false },
          { name: "Biotechnology", completed: false },
          { name: "Ecology", completed: false },
        ]
      },
      {
        chapter: "Zoology",
        completed: 2,
        total: 7,
        topics: [
          { name: "Diversity in Living World", completed: true },
          { name: "Structural Organization", completed: true },
          { name: "Human Physiology", completed: false },
          { name: "Reproduction", completed: false },
          { name: "Genetics and Evolution", completed: false },
          { name: "Biology and Human Welfare", completed: false },
          { name: "Biotechnology", completed: false },
        ]
      }
    ]
  };
  
  const [syllabus, setSyllabus] = useState<SyllabusType>(selectedExam === 'JEE' ? jeeSyllabus : neetSyllabus);
  
  useEffect(() => {
    setSyllabus(selectedExam === 'JEE' ? jeeSyllabus : neetSyllabus);
    setSelectedSubject('physics');
  }, [selectedExam]);
  
  const calculateProgress = (subject: any) => {
    let totalTopics = 0;
    let completedTopics = 0;
    
    subject.forEach((chapter: any) => {
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter((topic: any) => topic.completed).length;
    });
    
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };
  
  const toggleTopicCompletion = (chapterIndex: number, topicIndex: number) => {
    const updatedSyllabus = JSON.parse(JSON.stringify(syllabus));
    
    const subject = updatedSyllabus[selectedSubject][chapterIndex];
    const topic = subject.topics[topicIndex];
    topic.completed = !topic.completed;
    
    subject.completed = subject.topics.filter((t: any) => t.completed).length;
    
    if (subject.completed === subject.total) {
      setCompletedAlert({
        visible: true,
        chapter: subject.chapter
      });
      
      toast({
        title: "Chapter Completed!",
        description: `You've completed all topics in ${subject.chapter}`,
        variant: "default",
      });
      
      setTimeout(() => {
        setCompletedAlert(null);
      }, 5000);
    }
    
    setSyllabus(updatedSyllabus);
  };
  
  const filteredChapters = syllabus[selectedSubject as keyof typeof syllabus].filter((chapter: any) => {
    const matchesChapter = chapter.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = chapter.topics.some((topic: any) => 
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesChapter || matchesTopic;
  });

  const isJEESyllabus = (syllabus: SyllabusType): syllabus is JEESyllabus => {
    return 'mathematics' in syllabus;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Syllabus</h1>
              <p className="text-muted-foreground">Track your progress through the complete syllabus</p>
            </div>
            
            <div className="flex gap-2">
              <Badge 
                onClick={() => setSelectedExam('JEE')}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-primary/20",
                  selectedExam === 'JEE' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
                )}
              >
                JEE
              </Badge>
              <Badge 
                onClick={() => setSelectedExam('NEET')}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-primary/20",
                  selectedExam === 'NEET' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
                )}
              >
                NEET
              </Badge>
            </div>
          </div>
          
          {completedAlert && (
            <Alert className="mb-6" variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Chapter Completed!</AlertTitle>
              <AlertDescription>
                You've completed all topics in {completedAlert.chapter}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={cn("cursor-pointer transition-all duration-200", 
              selectedSubject === 'physics' ? "border-primary shadow-md" : "")}>
              <CardContent className="p-6" onClick={() => setSelectedSubject('physics')}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Physics</h3>
                  <Badge variant={selectedSubject === 'physics' ? "success" : "default"}>
                    {calculateProgress(syllabus.physics)}% Complete
                  </Badge>
                </div>
                <Progress value={calculateProgress(syllabus.physics)} className="h-2" />
              </CardContent>
            </Card>
            
            <Card className={cn("cursor-pointer transition-all duration-200", 
              selectedSubject === 'chemistry' ? "border-primary shadow-md" : "")}>
              <CardContent className="p-6" onClick={() => setSelectedSubject('chemistry')}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Chemistry</h3>
                  <Badge variant={selectedSubject === 'chemistry' ? "success" : "default"}>
                    {calculateProgress(syllabus.chemistry)}% Complete
                  </Badge>
                </div>
                <Progress value={calculateProgress(syllabus.chemistry)} className="h-2" />
              </CardContent>
            </Card>
            
            {isJEESyllabus(syllabus) ? (
              <Card className={cn("cursor-pointer transition-all duration-200", 
                selectedSubject === 'mathematics' ? "border-primary shadow-md" : "")}>
                <CardContent className="p-6" onClick={() => setSelectedSubject('mathematics')}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Mathematics</h3>
                    <Badge variant={selectedSubject === 'mathematics' ? "success" : "default"}>
                      {calculateProgress(syllabus.mathematics)}% Complete
                    </Badge>
                  </div>
                  <Progress value={calculateProgress(syllabus.mathematics)} className="h-2" />
                </CardContent>
              </Card>
            ) : (
              <Card className={cn("cursor-pointer transition-all duration-200", 
                selectedSubject === 'biology' ? "border-primary shadow-md" : "")}>
                <CardContent className="p-6" onClick={() => setSelectedSubject('biology')}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Biology</h3>
                    <Badge variant={selectedSubject === 'biology' ? "success" : "default"}>
                      {calculateProgress((syllabus as NEETSyllabus).biology)}% Complete
                    </Badge>
                  </div>
                  <Progress value={calculateProgress((syllabus as NEETSyllabus).biology)} className="h-2" />
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chapters or topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-6">
            {filteredChapters.map((chapter: any, chapterIndex: number) => (
              <Card key={chapter.chapter} className="overflow-hidden">
                <div className="p-6 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{chapter.chapter}</h3>
                    </div>
                    <Badge variant={chapter.completed === chapter.total ? "success" : "default"}>
                      {chapter.completed}/{chapter.total} topics
                    </Badge>
                  </div>
                  <Progress value={(chapter.completed / chapter.total) * 100} className="h-2 mt-4" />
                </div>
                
                <div className="divide-y divide-border/40">
                  {chapter.topics.map((topic: any, topicIndex: number) => (
                    <div 
                      key={topic.name}
                      className={cn(
                        "p-4 flex items-center justify-between transition-colors",
                        topic.completed ? "bg-success/5" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={`topic-${chapterIndex}-${topicIndex}`}
                          checked={topic.completed}
                          onCheckedChange={() => toggleTopicCompletion(chapterIndex, topicIndex)}
                        />
                        <label 
                          htmlFor={`topic-${chapterIndex}-${topicIndex}`}
                          className={cn(
                            "cursor-pointer",
                            topic.completed ? "line-through text-muted-foreground" : ""
                          )}
                        >
                          {topic.name}
                        </label>
                      </div>
                      {topic.completed && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            
            {filteredChapters.length === 0 && (
              <div className="text-center py-12">
                <BookOpenCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No chapters found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query to find chapters or topics
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Syllabus;
