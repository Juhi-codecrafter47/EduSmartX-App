import React, { useState } from 'react';
import { File, Download, Timer, BarChart, Bookmark, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const QuestionPapers = () => {
  const [selectedExam, setSelectedExam] = useState<'JEE' | 'NEET'>('JEE');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [openPaper, setOpenPaper] = useState<any | null>(null);
  const [papers, setPapers] = useState({
    JEE: {
      '2023': [
        {
          id: 'jee-2023-1',
          title: 'JEE Main Paper 1',
          type: 'Multiple Choice',
          questions: 90,
          time: 180,
          difficulty: 'Hard',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: true,
          score: 78,
        },
        {
          id: 'jee-2023-2',
          title: 'JEE Main Paper 2',
          type: 'Multiple Choice',
          questions: 90,
          time: 180,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: false,
          score: null,
        },
        {
          id: 'jee-2023-advanced',
          title: 'JEE Advanced',
          type: 'Multiple Choice & Numerical',
          questions: 54,
          time: 180,
          difficulty: 'Very Hard',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: false,
          score: null,
        },
      ],
      '2022': [
        {
          id: 'jee-2022-1',
          title: 'JEE Main Paper 1',
          type: 'Multiple Choice',
          questions: 90,
          time: 180,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: true,
          score: 82,
        },
        {
          id: 'jee-2022-2',
          title: 'JEE Main Paper 2',
          type: 'Multiple Choice',
          questions: 90,
          time: 180,
          difficulty: 'Hard',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: true,
          score: 75,
        },
      ],
      '2021': [
        {
          id: 'jee-2021-1',
          title: 'JEE Main Paper 1',
          type: 'Multiple Choice',
          questions: 90,
          time: 180,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          attempted: true,
          score: 70,
        },
      ],
    },
    NEET: {
      '2023': [
        {
          id: 'neet-2023',
          title: 'NEET-UG 2023',
          type: 'Multiple Choice',
          questions: 180,
          time: 200,
          difficulty: 'Hard',
          subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
          attempted: true,
          score: 85,
        },
        {
          id: 'neet-2023-mock-1',
          title: 'NEET-UG Mock Test 1',
          type: 'Multiple Choice',
          questions: 180,
          time: 200,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
          attempted: false,
          score: null,
        },
      ],
      '2022': [
        {
          id: 'neet-2022',
          title: 'NEET-UG 2022',
          type: 'Multiple Choice',
          questions: 180,
          time: 200,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
          attempted: true,
          score: 78,
        },
      ],
      '2021': [
        {
          id: 'neet-2021',
          title: 'NEET-UG 2021',
          type: 'Multiple Choice',
          questions: 180,
          time: 200,
          difficulty: 'Medium',
          subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
          attempted: true,
          score: 72,
        },
      ],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const availableYears = Object.keys(papers[selectedExam]).sort((a, b) => parseInt(b) - parseInt(a));

  const currentPapers = papers[selectedExam][selectedYear];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Hard':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Very Hard':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const PaperView = ({ paper }: { paper: any }) => {
    const dummyQuestions = [
      {
        id: 1,
        text: 'A ball is thrown vertically upward with a velocity of 20 m/s. The maximum height reached by the ball is (g = 10 m/s²):',
        options: ['10 m', '20 m', '30 m', '40 m'],
        answer: 1,
        subject: 'Physics',
        difficulty: 'Medium',
      },
      {
        id: 2,
        text: 'Calculate the pH of a 0.01 M solution of HCl:',
        options: ['1', '2', '3', '4'],
        answer: 1,
        subject: 'Chemistry',
        difficulty: 'Easy',
      },
      {
        id: 3,
        text: 'If f(x) = x² + 2x + 1, then f\'(x) is:',
        options: ['2x + 2', 'x + 2', '2x', 'x + 1'],
        answer: 0,
        subject: 'Mathematics',
        difficulty: 'Easy',
      },
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

    const currentQuestion = dummyQuestions[currentQuestionIndex];

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
      setSelectedOptions({
        ...selectedOptions,
        [questionId]: optionIndex,
      });
    };

    const toggleBookmark = (questionId: number) => {
      if (bookmarkedQuestions.includes(questionId)) {
        setBookmarkedQuestions(bookmarkedQuestions.filter(id => id !== questionId));
      } else {
        setBookmarkedQuestions([...bookmarkedQuestions, questionId]);
      }
    };

    const goToNextQuestion = () => {
      if (currentQuestionIndex < dummyQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    const goToPreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };

    const handleSubmit = () => {
      setSubmitDialogOpen(false);
      setIsSubmitting(true);
      
      const correctAnswers = dummyQuestions.filter(
        (q) => selectedOptions[q.id] === q.answer
      ).length;
      
      const scorePercent = Math.round((correctAnswers / dummyQuestions.length) * 100);
      setCurrentScore(scorePercent);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowResults(true);
        
        const updatedPapers = {...papers};
        const paperIndex = updatedPapers[selectedExam][selectedYear].findIndex(p => p.id === paper.id);
        
        if (paperIndex !== -1) {
          updatedPapers[selectedExam][selectedYear][paperIndex] = {
            ...updatedPapers[selectedExam][selectedYear][paperIndex],
            attempted: true,
            score: scorePercent
          };
          
          setPapers(updatedPapers);
        }
        
        toast({
          title: "Paper submitted successfully!",
          description: `You scored ${scorePercent}% on this paper.`,
          variant: "success",
        });
      }, 1500);
    };

    const answeredCount = Object.keys(selectedOptions).length;
    const totalQuestions = dummyQuestions.length;
    const unansweredCount = totalQuestions - answeredCount;

    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{paper.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
              <Timer size={16} />
              <span>{paper.time} minutes</span>
              <span className="mx-2">•</span>
              <BarChart size={16} />
              <span>{paper.questions} questions</span>
            </div>
          </div>
          <Badge className={getDifficultyColor(paper.difficulty)}>
            {paper.difficulty}
          </Badge>
        </div>

        {!showResults ? (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {dummyQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    currentQuestionIndex === index
                      ? 'bg-primary text-white'
                      : selectedOptions[q.id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : bookmarkedQuestions.includes(q.id)
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                    <Badge variant="outline">{currentQuestion.subject}</Badge>
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-lg">{currentQuestion.text}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(currentQuestion.id)}
                  className={bookmarkedQuestions.includes(currentQuestion.id) ? 'text-yellow-500' : ''}
                >
                  <Bookmark size={20} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedOptions[currentQuestion.id] === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.id, index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                            selectedOptions[currentQuestion.id] === index
                              ? 'bg-primary text-white'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setSubmitDialogOpen(true)}
                  className="mx-2"
                >
                  Submit Paper
                </Button>
                
                <Button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === dummyQuestions.length - 1}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
            
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Paper</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to submit your answers? You have answered {answeredCount} out of {totalQuestions} questions.
                    {unansweredCount > 0 && ` There are still ${unansweredCount} unanswered questions.`}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Answers"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                You scored {currentScore}% on {paper.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{currentScore}%</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {dummyQuestions.map((question, index) => {
                  const isCorrect = selectedOptions[question.id] === question.answer;
                  const hasAnswered = selectedOptions[question.id] !== undefined;
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mt-0.5 ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800'
                            : hasAnswered
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`p-2 rounded text-sm ${
                                  question.answer === optIndex
                                    ? 'bg-green-100 text-green-800' 
                                    : selectedOptions[question.id] === optIndex
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-secondary/50'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {question.answer === optIndex && ' ✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => {
                  setShowResults(false);
                  setSelectedOptions({});
                  setCurrentQuestionIndex(0);
                }}
              >
                Retry
              </Button>
              <Button onClick={() => setOpenPaper(null)}>Close</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Question Papers</h1>
            <p className="text-muted-foreground mt-1">
              Practice with previous years' question papers
            </p>
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

        <Tabs
          value={selectedYear}
          onValueChange={setSelectedYear}
          className="w-full mb-8"
        >
          <TabsList className="flex">
            {availableYears.map((year) => (
              <TabsTrigger key={year} value={year} className="flex-1">
                {year}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPapers.map((paper) => (
            <Card
              key={paper.id}
              className="overflow-hidden"
            >
              <div className="h-3 bg-primary"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{paper.title}</CardTitle>
                  <Badge className={getDifficultyColor(paper.difficulty)}>
                    {paper.difficulty}
                  </Badge>
                </div>
                <CardDescription>
                  {paper.type} • {paper.subjects.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-semibold">{paper.questions}</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-semibold">{paper.time}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>

                {paper.attempted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-green-800">Completed</div>
                      <div className="text-sm text-green-600">Score: {paper.score}%</div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <Button variant="outline" className="w-1/2" asChild>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Download size={16} className="mr-2" />
                    PDF
                  </a>
                </Button>
                <Button
                  className="w-1/2 ml-2"
                  onClick={() => setOpenPaper(paper)}
                >
                  {paper.attempted ? 'Review' : 'Start'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={!!openPaper} onOpenChange={(open) => !open && setOpenPaper(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between">
                  <span>Question Paper</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenPaper(null)}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Answer the questions and track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto mt-4">
              {openPaper && <PaperView paper={openPaper} />}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionPapers;
