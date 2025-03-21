import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Search, BookOpenCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  chapterName: string;
  topics: Topic[];
};

type Subject = {
  subjectName: string;
  chapters: Chapter[];
};

type Course = {
  courseName: string;
  subjects: Subject[];
};

const Syllabus = () => {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<'JEE' | 'NEET'>('JEE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [completedAlert, setCompletedAlert] = useState<{ visible: boolean, chapter: string } | null>(null);
  const [syllabus, setSyllabus] = useState<Course[] | null>(null);
  const [userId] = useState('your-user-id'); // Replace with actual user ID

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await fetch('http://localhost:8000/h2c/getSyllabus');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        console.log("Fetched Syllabus Data:", JSON.stringify(data, null, 2)); // Debugging

        setSyllabus(data.data);
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      }
    };

    fetchSyllabus();
  }, []);

  const calculateProgress = (subject: Subject) => {
    let totalTopics = 0;
    let completedTopics = 0;

    subject.chapters.forEach((chapter: Chapter) => {
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter((topic: Topic) => topic.completed).length;
    });

    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  const toggleTopicCompletion = (subjectIndex: number, chapterIndex: number, topicIndex: number) => {
    if (!syllabus) return;

    const updatedSyllabus = JSON.parse(JSON.stringify(syllabus));
    const subject = updatedSyllabus[0].subjects[subjectIndex];
    const chapter = subject.chapters[chapterIndex];
    const topic = chapter.topics[topicIndex];
    topic.completed = !topic.completed;

    // If chapter is fully completed, show alert
    if (chapter.topics.every(t => t.completed)) {
      setCompletedAlert({
        visible: true,
        chapter: chapter.chapterName
      });

      toast({
        title: "Chapter Completed!",
        description: `You've completed all topics in ${chapter.chapterName}`,
        variant: "default",
      });

      setTimeout(() => {
        setCompletedAlert(null);
      }, 5000);
    }

    setSyllabus(updatedSyllabus);

    fetch('http://localhost:8000/h2c/completedtopic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, topicId: topic.name, completed: topic.completed }),
    }).catch(error => console.error('Error updating progress:', error));
  };

  const filteredChapters = syllabus?.[0]?.subjects.find(subject => subject.subjectName.toLowerCase() === selectedSubject.toLowerCase())
    ?.chapters.filter((chapter: Chapter) => {
      const matchesChapter = chapter.chapterName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Ensure chapter.topics exists before calling .some()
      const matchesTopic = chapter.topics?.some((topic: Topic) =>
        topic.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? false;

      return matchesChapter || matchesTopic;
    }) || [];


  // const filteredChapters = syllabus?.[0]?.subjects
  // .find(subject => subject.subjectName.toLowerCase() === selectedSubject.toLowerCase())
  // ?.chapters.filter((chapter) => {
  //   const matchesChapter = chapter.chapterName?.toLowerCase().includes(searchQuery.toLowerCase());

  //   // Ensure topics exist and match searchQuery
  //   const matchesTopic = chapter.topics?.some((topic) =>
  //     topic.toLowerCase().includes(searchQuery.toLowerCase())
  //   ) ?? false;

  //   return matchesChapter || matchesTopic;
  // }) || [];


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
            {syllabus?.[0]?.subjects.map((subject, subjectIndex) => (
              <Card
                key={subject.subjectName}
                className={cn("cursor-pointer transition-all duration-200",
                  selectedSubject === subject.subjectName ? "border-primary shadow-md" : "")}
              >
                <CardContent className="p-6" onClick={() => setSelectedSubject(subject.subjectName)}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{subject.subjectName}</h3>
                    <Badge variant={selectedSubject === subject.subjectName ? "success" : "default"}>
                      {calculateProgress(subject)}% Complete
                    </Badge>
                  </div>
                  <Progress value={calculateProgress(subject)} className="h-2" />
                </CardContent>
              </Card>
            ))}
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
          {filteredChapters.map((chapter, chapterIndex) => {
  const subjectIndex = syllabus![0].subjects.findIndex(
    (subject) => subject.subjectName === selectedSubject
  );
  
  // Convert string topics into objects with a `completed` field
  const topics = (chapter.topics || []).map((topic) =>
    typeof topic === "string" ? { name: topic, completed: false } : topic
  );

  return (
    <Card
      key={`${selectedSubject}-${chapterIndex}-${chapter.chapterName}`}
      className="overflow-hidden"
    >
      <div className="p-6 bg-muted/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{chapter.chapterName}</h3>
          </div>
          <Badge
            variant={topics.length > 0 && topics.every((t) => t.completed) ? "success" : "default"}
          >
            {topics.filter((t) => t.completed).length}/{topics.length} topics
          </Badge>
        </div>
        <Progress
          value={topics.length > 0 ? (topics.filter((t) => t.completed).length / topics.length) * 100 : 0}
          className="h-2 mt-4"
        />
      </div>

      <div className="divide-y divide-border/40">
        {topics.length > 0 ? (
          topics.map((topic, topicIndex) => (
            <div
              key={`${chapter.chapterName}-${chapterIndex}-${topicIndex}-${topic.name}`}
              className={cn(
                "p-4 flex items-center justify-between transition-colors",
                topic.completed ? "bg-success/5" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`topic-${chapterIndex}-${topicIndex}`}
                  checked={topic.completed}
                  onCheckedChange={() =>
                    toggleTopicCompletion(subjectIndex, chapterIndex, topicIndex)
                  }
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
              {topic.completed && <CheckCircle className="h-4 w-4 text-success" />}
            </div>
          ))
        ) : (
          <div className="p-4 text-muted-foreground text-center">
            No topics available
          </div>
        )}
      </div>
    </Card>
  );
})}


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
