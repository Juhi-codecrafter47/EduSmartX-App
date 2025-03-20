import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Lightbulb, 
  Zap, 
  Timer, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  BarChart,
  ChevronRight,
  Bookmark,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<'JEE' | 'NEET'>('JEE');
  const [quizMode, setQuizMode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizResults, setQuizResults] = useState({
    score: 0,
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    timeUsed: 0,
  });
  
  const subjects = {
    JEE: ['Physics', 'Chemistry', 'Mathematics'],
    NEET: ['Physics', 'Chemistry', 'Biology'],
  };
  
  const chapters = {
    Physics: ['Mechanics', 'Thermodynamics', 'Electrodynamics', 'Optics', 'Modern Physics'],
    Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    Mathematics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry'],
    Biology: ['Botany', 'Zoology', 'Human Physiology', 'Genetics'],
  };
  
  const topics = {
    Mechanics: ['Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion'],
    'Physical Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Solutions'],
    Algebra: ['Complex Numbers', 'Matrices & Determinants', 'Quadratic Equations', 'Progressions'],
    Botany: ['Plant Anatomy', 'Plant Physiology', 'Plant Reproduction', 'Ecology'],
  };
  
  const quizQuestions = [
    {
      id: 1,
      text: 'A ball is thrown vertically upward with a velocity of 20 m/s. The maximum height reached by the ball is (g = 10 m/s²):',
      options: ['10 m', '20 m', '30 m', '40 m'],
      correctAnswer: 1,
      explanation: 'Using the equation h = v²/2g, where v is initial velocity and g is acceleration due to gravity. h = (20 m/s)²/(2×10 m/s²) = 400/20 = 20 m.',
      difficulty: 'medium',
      subject: 'Physics',
      chapter: 'Mechanics',
      topic: 'Kinematics',
    },
    {
      id: 2,
      text: 'Which of the following is NOT a unit of energy?',
      options: ['Joule', 'Calorie', 'Electron-volt', 'Tesla'],
      correctAnswer: 3,
      explanation: 'Tesla is a unit of magnetic field strength, not energy. Joule, calorie, and electron-volt are all units of energy.',
      difficulty: 'easy',
      subject: 'Physics',
      chapter: 'Mechanics',
      topic: 'Work, Energy & Power',
    },
    {
      id: 3,
      text: 'The pH of a 0.001 M HCl solution at 25°C is:',
      options: ['1', '2', '3', '4'],
      correctAnswer: 2,
      explanation: 'pH = -log[H⁺]. For 0.001 M HCl, [H⁺] = 0.001 M. pH = -log(0.001) = 3.',
      difficulty: 'medium',
      subject: 'Chemistry',
      chapter: 'Physical Chemistry',
      topic: 'Solutions',
    },
    {
      id: 4,
      text: 'The value of lim(x→0) (sin x)/x is:',
      options: ['0', '1', 'Infinity', 'Undefined'],
      correctAnswer: 1,
      explanation: 'This is a well-known limit in calculus. As x approaches 0, (sin x)/x approaches 1.',
      difficulty: 'medium',
      subject: 'Mathematics',
      chapter: 'Calculus',
      topic: 'Limits',
    },
    {
      id: 5,
      text: 'Which of the following is the correct formula for the quadratic equation?',
      options: [
        'ax + b = 0',
        'ax² + bx + c = 0',
        'ax³ + bx² + cx + d = 0',
        'x² + y² = r²'
      ],
      correctAnswer: 1,
      explanation: 'The standard form of a quadratic equation is ax² + bx + c = 0, where a ≠ 0.',
      difficulty: 'easy',
      subject: 'Mathematics',
      chapter: 'Algebra',
      topic: 'Quadratic Equations',
    },
  ];
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
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
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
      setQuizCompleted(true);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    
    quizQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      } else if (selectedAnswers[question.id] !== undefined) {
        incorrect++;
      }
    });
    
    const unanswered = quizQuestions.length - correct - incorrect;
    const score = Math.round((correct / quizQuestions.length) * 100);
    const timeUsed = 600 - timeLeft;
    
    setQuizResults({
      score,
      correct,
      incorrect,
      unanswered,
      timeUsed,
    });
  };
  
  const startQuiz = () => {
    setQuizStarted(true);
    setSelectedAnswers({});
    setBookmarkedQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(600);
    setQuizCompleted(false);
  };
  
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentStep(1);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setQuizMode(null);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'hard':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const renderQuizSetup = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Choose Quiz Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  quizMode === 'topic' && "border-primary"
                )}
                onClick={() => setQuizMode('topic')}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#5856D6]/10 flex items-center justify-center text-[#5856D6] mb-4">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Topic-wise Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a specific topic to focus on mastering one concept at a time.
                  </p>
                </CardContent>
              </Card>
              
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  quizMode === 'subject' && "border-primary"
                )}
                onClick={() => setQuizMode('subject')}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500] mb-4">
                    <Lightbulb size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Subject Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a comprehensive quiz on an entire subject with mixed topics.
                  </p>
                </CardContent>
              </Card>
              
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  quizMode === 'full' && "border-primary"
                )}
                onClick={() => setQuizMode('full')}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55] mb-4">
                    <Zap size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Full {selectedExam} Paper</h3>
                  <p className="text-sm text-muted-foreground">
                    Simulate a complete exam experience with questions from all subjects.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={!quizMode}
              >
                Continue <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        );

        const fetchSubjects = async () => {
          try {
            const res = await axios.post("http://localhost:8080/")
            console.log(res.data)


          } catch (error) {
            
          }}
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">
              {quizMode === 'full' ? 'Ready for Full Paper' : 'Select Subject'}
            </h2>
            
            {quizMode === 'full' ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55]">
                      <Zap size={32} />
                    </div>
                  </div>
                  
                  <h3 className="text-center font-semibold text-lg mb-2">
                    Full {selectedExam} Paper Simulation
                  </h3>
                  <p className="text-center text-muted-foreground mb-6">
                    You'll be challenged with questions from all subjects in a timed environment.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center">
                      <div className="text-2xl font-semibold">{selectedExam === 'JEE' ? 90 : 180}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center">
                      <div className="text-2xl font-semibold">180</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg flex flex-col items-center">
                      <div className="text-2xl font-semibold">Mixed</div>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button size="lg" onClick={startQuiz}>
                      Start Full Paper
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects[selectedExam].map((subject) => (
                  <Card
                    key={subject}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedSubject === subject && "border-primary"
                    )}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
                        subject === 'Physics' && "bg-[#34C759]/10 text-[#34C759]",
                        subject === 'Chemistry' && "bg-[#FF9500]/10 text-[#FF9500]",
                        subject === 'Mathematics' && "bg-[#AF52DE]/10 text-[#AF52DE]",
                        subject === 'Biology' && "bg-[#5856D6]/10 text-[#5856D6]"
                      )}>
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">{subject}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {chapters[subject as keyof typeof chapters].length} chapters
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {quizMode !== 'full' && (
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => {
                    if (quizMode === 'subject' && selectedSubject) {
                      startQuiz();
                    } else {
                      setCurrentStep(3);
                    }
                  }} 
                  disabled={!selectedSubject}
                >
                  {quizMode === 'subject' ? 'Start Quiz' : 'Continue'} <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Select Chapter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSubject && chapters[selectedSubject as keyof typeof chapters].map((chapter) => (
                <Card
                  key={chapter}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedChapter === chapter && "border-primary"
                  )}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
                      selectedSubject === 'Physics' && "bg-[#34C759]/10 text-[#34C759]",
                      selectedSubject === 'Chemistry' && "bg-[#FF9500]/10 text-[#FF9500]",
                      selectedSubject === 'Mathematics' && "bg-[#AF52DE]/10 text-[#AF52DE]",
                      selectedSubject === 'Biology' && "bg-[#5856D6]/10 text-[#5856D6]"
                    )}>
                      <BookOpen size={24} />
                    </div>
                    <h3 className="font-semibold text-lg">{chapter}</h3>
                    {topics[chapter as keyof typeof topics] && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {topics[chapter as keyof typeof topics].length} topics
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(4)} 
                disabled={!selectedChapter}
              >
                Continue <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Select Topic</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedChapter && 
               topics[selectedChapter as keyof typeof topics] && 
               topics[selectedChapter as keyof typeof topics].map((topic) => (
                <Card
                  key={topic}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedTopic === topic && "border-primary"
                  )}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
                      selectedSubject === 'Physics' && "bg-[#34C759]/10 text-[#34C759]",
                      selectedSubject === 'Chemistry' && "bg-[#FF9500]/10 text-[#FF9500]",
                      selectedSubject === 'Mathematics' && "bg-[#AF52DE]/10 text-[#AF52DE]",
                      selectedSubject === 'Biology' && "bg-[#5856D6]/10 text-[#5856D6]"
                    )}>
                      <BookOpen size={24} />
                    </div>
                    <h3 className="font-semibold text-lg">{topic}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      5-10 questions
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(3)}
              >
                Back
              </Button>
              <Button 
                onClick={startQuiz} 
                disabled={!selectedTopic}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const renderQuizInProgress = () => {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {quizMode === 'topic' 
                ? `${selectedTopic} Quiz` 
                : quizMode === 'subject' 
                  ? `${selectedSubject} Quiz` 
                  : `${selectedExam} Full Paper`}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
              <Timer size={16} />
              <span>Time: {formatTime(timeLeft)}</span>
              <span className="mx-2">•</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
          </div>
          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
            {currentQuestion.difficulty}
          </Badge>
        </div>
        
        <div className="mb-6">
          <Progress 
            value={(currentQuestionIndex / (quizQuestions.length - 1)) * 100} 
            className="h-2" 
          />
        </div>
        
        <Card className="flex-1 mb-6">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                <Badge variant="outline">{currentQuestion.subject}</Badge>
                <Badge variant="outline">{currentQuestion.chapter}</Badge>
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
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id]?.toString() || ''} 
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                      className="border-primary"
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={goToNextQuestion}
          >
            {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium mb-2">Question Navigation:</h3>
          <div className="flex flex-wrap gap-2">
            {quizQuestions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => jumpToQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentQuestionIndex === index
                    ? 'bg-primary text-white'
                    : selectedAnswers[question.id] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : bookmarkedQuestions.includes(question.id)
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-secondary text-foreground'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderQuizResults = () => {
    return (
      <div className="animate-fade-in">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              Here's how you did on the {quizMode === 'topic' 
                ? `${selectedTopic}` 
                : quizMode === 'subject' 
                  ? `${selectedSubject}` 
                  : `${selectedExam} Full Paper`} quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <div className="text-4xl font-bold">{quizResults.score}%</div>
              </div>
              <div className="text-lg font-medium">
                {quizResults.score >= 80 
                  ? 'Excellent!' 
                  : quizResults.score >= 60 
                    ? 'Good job!' 
                    : 'Keep practicing!'}
              </div>
              <div className="text-sm text-muted-foreground">
                Time used: {Math.floor(quizResults.timeUsed / 60)}:{(quizResults.timeUsed % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="font-medium text-green-800">Correct</div>
                  <div className="text-xl text-green-600">{quizResults.correct} / {quizQuestions.length}</div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="font-medium text-red-800">Incorrect</div>
                  <div className="text-xl text-red-600">{quizResults.incorrect} / {quizQuestions.length}</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="font-medium text-yellow-800">Unanswered</div>
                  <div className="text-xl text-yellow-600">{quizResults.unanswered} / {quizQuestions.length}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Performance Analysis</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Physics</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Chemistry</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{selectedExam === 'JEE' ? 'Mathematics' : 'Biology'}</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4">
            <Button 
              variant="outline" 
              className="w-full md:w-1/2"
              onClick={restartQuiz}
            >
              Try Another Quiz
            </Button>
            <Button 
              className="w-full md:w-1/2"
              onClick={() => {
                setQuizStarted(false);
                setQuizCompleted(false);
              }}
            >
              Review Answers
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-12">
        {!quizStarted && !quizCompleted && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quiz</h1>
              <p className="text-muted-foreground mt-1">Take personalized quizzes to test your knowledge</p>
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
        )}
        
        <div>
          {!quizStarted && !quizCompleted && renderQuizSetup()}
          {quizStarted && !quizCompleted && renderQuizInProgress()}
          {quizCompleted && renderQuizResults()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quiz;
