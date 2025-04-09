
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, ChevronDown, Database } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import QuestionBankSelector, { QuestionType } from '@/components/assessment/QuestionBankSelector';
import { AssessmentType } from '@/models/assessment';

interface Section {
  id: string;
  name: string;
  duration: number;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple-choice' | 'coding' | 'subjective' | 'personality';
}

const CreateAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('aptitude');
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      name: 'Section 1',
      duration: 30,
      questions: [
        {
          id: '1',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    }
  ]);
  
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const addSection = () => {
    setSections([...sections, {
      id: (sections.length + 1).toString(),
      name: `Section ${sections.length + 1}`,
      duration: 30,
      questions: [
        {
          id: '1',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    }]);
  };
  
  const updateSection = (index: number, field: keyof Section, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };
  
  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };
  
  const addQuestion = (sectionIndex: number, question?: QuestionType) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    
    if (question) {
      // Add question from question bank
      section.questions.push({
        ...question,
        id: (section.questions.length + 1).toString(),
      });
    } else {
      // Add empty question
      section.questions.push({
        id: (section.questions.length + 1).toString(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        type: 'multiple-choice',
        difficulty: 'easy'
      });
    }
    
    setSections(updatedSections);
  };
  
  const updateQuestion = (sectionIndex: number, questionIndex: number, field: keyof Question, value: any) => {
    const updatedSections = [...sections];
    const question = updatedSections[sectionIndex].questions[questionIndex];
    
    if (field === 'options' && typeof value === 'string' && typeof value[1] === 'number') {
      // Update a specific option
      const [optionValue, optionIndex] = value;
      question.options[optionIndex] = optionValue;
    } else {
      // Update other fields
      (question[field] as any) = value;
    }
    
    setSections(updatedSections);
  };
  
  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(updatedSections);
  };
  
  const getTotalDuration = () => {
    return sections.reduce((total, section) => total + section.duration, 0);
  };
  
  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + section.questions.length, 0);
  };
  
  const handleAddFromQuestionBank = (question: QuestionType) => {
    addQuestion(currentSectionIndex, question);
    setShowQuestionBank(false);
    
    toast({
      title: "Question added",
      description: "Question has been added to the section"
    });
  };
  
  const handleSaveDraft = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the assessment",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Draft saved",
      description: "Assessment has been saved as a draft."
    });
    
    navigate('/assessments');
  };
  
  const handlePublish = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the assessment",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for the assessment",
        variant: "destructive"
      });
      return;
    }
    
    // Validate sections and questions
    for (const section of sections) {
      if (!section.name || section.duration <= 0) {
        toast({
          title: "Invalid section",
          description: "All sections must have a name and duration",
          variant: "destructive"
        });
        return;
      }
      
      for (const question of section.questions) {
        if (!question.text) {
          toast({
            title: "Empty question",
            description: `Please enter text for all questions in ${section.name}`,
            variant: "destructive"
          });
          return;
        }
        
        // Skip validation for coding and subjective questions as they don't need options
        if (question.type !== 'coding' && question.type !== 'subjective') {
          for (const option of question.options) {
            if (!option) {
              toast({
                title: "Empty option",
                description: "Please fill in all answer options",
                variant: "destructive"
              });
              return;
            }
          }
        }
      }
    }
    
    toast({
      title: "Assessment published",
      description: "Assessment has been published successfully."
    });
    
    navigate('/assessments');
  };

  const renderAssessmentTypeDescription = () => {
    switch(assessmentType) {
      case 'aptitude':
        return "Evaluate candidates' cognitive abilities, logical reasoning, and problem-solving skills.";
      case 'coding':
        return "Assess candidates' programming skills, algorithm knowledge, and code quality.";
      case 'personality':
        return "Understand candidates' behavior patterns, work style, and cultural fit.";
      case 'interview':
        return "Simulate interview scenarios or group discussions to evaluate communication skills.";
      default:
        return "";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Assessment</h1>
            <p className="text-muted-foreground">
              Design a new assessment with customized sections and questions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save as Draft
            </Button>
            <Button onClick={handlePublish}>
              Publish Assessment
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
              <CardDescription>
                Set the basic information for the assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Data Structures & Algorithms" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assessment Type</Label>
                <RadioGroup 
                  value={assessmentType} 
                  onValueChange={(value: AssessmentType) => setAssessmentType(value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="aptitude" id="aptitude" />
                    <Label htmlFor="aptitude" className="cursor-pointer">Aptitude Test</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="coding" id="coding" />
                    <Label htmlFor="coding" className="cursor-pointer">Coding Challenge</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="personality" id="personality" />
                    <Label htmlFor="personality" className="cursor-pointer">Personality Assessment</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="interview" id="interview" />
                    <Label htmlFor="interview" className="cursor-pointer">Interview Simulation</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground mt-2">{renderAssessmentTypeDescription()}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter assessment description..." 
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mr-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="font-medium">{getTotalDuration()} minutes</p>
                  </div>
                </div>
                <div className="p-4 border rounded-md flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mr-3">
                    <div className="font-medium">{sections.length}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sections</p>
                    <p className="font-medium">{sections.length}</p>
                  </div>
                </div>
                <div className="p-4 border rounded-md flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mr-3">
                    <div className="font-medium">{getTotalQuestions()}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="font-medium">{getTotalQuestions()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assessment Sections</CardTitle>
                <CardDescription>
                  Create and configure sections for the assessment
                </CardDescription>
              </div>
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-1" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={sections[0]?.id.toString()}>
                <TabsList className="mb-4">
                  {sections.map((section) => (
                    <TabsTrigger key={section.id} value={section.id.toString()}>
                      {section.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {sections.map((section, sectionIndex) => (
                  <TabsContent key={section.id} value={section.id.toString()} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`section-name-${section.id}`}>Section Name</Label>
                        <Input
                          id={`section-name-${section.id}`}
                          value={section.name}
                          onChange={(e) => updateSection(sectionIndex, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`section-duration-${section.id}`}>Duration (minutes)</Label>
                        <Input
                          id={`section-duration-${section.id}`}
                          type="number"
                          min="1"
                          value={section.duration}
                          onChange={(e) => updateSection(sectionIndex, 'duration', parseInt(e.target.value))}
                        />
                      </div>
                      {sections.length > 1 && (
                        <div className="flex justify-end md:col-span-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeSection(sectionIndex)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Section
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Questions</h3>
                        <div className="flex space-x-2">
                          <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setCurrentSectionIndex(sectionIndex)}
                              >
                                <Database className="h-4 w-4 mr-1" />
                                Add from Question Bank
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Question Bank</DialogTitle>
                                <DialogDescription>
                                  Browse and add questions from the question bank
                                </DialogDescription>
                              </DialogHeader>
                              <QuestionBankSelector onAddQuestion={handleAddFromQuestionBank} />
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" onClick={() => addQuestion(sectionIndex)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add New Question
                          </Button>
                        </div>
                      </div>
                      
                      {section.questions.map((question, questionIndex) => (
                        <Card key={question.id} className="border-emerald-100 shadow-sm">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                              {section.questions.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`question-type-${section.id}-${question.id}`}>Question Type</Label>
                                <Select
                                  value={question.type || 'multiple-choice'}
                                  onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'type', value)}
                                >
                                  <SelectTrigger id={`question-type-${section.id}-${question.id}`}>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                    <SelectItem value="coding">Coding</SelectItem>
                                    <SelectItem value="subjective">Subjective</SelectItem>
                                    <SelectItem value="personality">Personality</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`question-difficulty-${section.id}-${question.id}`}>Difficulty Level</Label>
                                <Select
                                  value={question.difficulty || 'easy'}
                                  onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'difficulty', value)}
                                >
                                  <SelectTrigger id={`question-difficulty-${section.id}-${question.id}`}>
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`question-category-${section.id}-${question.id}`}>Category</Label>
                              <Select
                                value={question.category || 'technical'}
                                onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'category', value)}
                              >
                                <SelectTrigger id={`question-category-${section.id}-${question.id}`}>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="technical">Technical</SelectItem>
                                  <SelectItem value="quantitative">Quantitative</SelectItem>
                                  <SelectItem value="verbal">Verbal</SelectItem>
                                  <SelectItem value="logical-reasoning">Logical Reasoning</SelectItem>
                                  <SelectItem value="problem-solving">Problem Solving</SelectItem>
                                  <SelectItem value="personality">Personality</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`question-text-${section.id}-${question.id}`}>Question</Label>
                              <Textarea
                                id={`question-text-${section.id}-${question.id}`}
                                placeholder="Enter question text..."
                                value={question.text}
                                onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'text', e.target.value)}
                              />
                            </div>
                            
                            {(question.type !== 'coding' && question.type !== 'subjective') && (
                              <div className="space-y-3">
                                <Label>Answer Options</Label>
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      value={option}
                                      onChange={(e) => {
                                        const updatedOptions = [...question.options];
                                        updatedOptions[optionIndex] = e.target.value;
                                        updateQuestion(sectionIndex, questionIndex, 'options', updatedOptions);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {(question.type !== 'coding' && question.type !== 'subjective') && (
                              <div className="space-y-2">
                                <Label htmlFor={`correct-answer-${section.id}-${question.id}`}>Correct Answer</Label>
                                <Select
                                  value={question.correctAnswer.toString()}
                                  onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'correctAnswer', parseInt(value))}
                                >
                                  <SelectTrigger id={`correct-answer-${section.id}-${question.id}`}>
                                    <SelectValue placeholder="Select the correct answer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {question.options.map((option, idx) => (
                                      <SelectItem key={idx} value={idx.toString()}>
                                        Option {idx + 1}: {option || `(Empty option ${idx + 1})`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            
                            {(question.difficulty || question.category) && (
                              <div className="flex gap-1 mt-2">
                                {question.difficulty && (
                                  <Badge variant={
                                    question.difficulty === 'easy' ? 'outline' : 
                                    question.difficulty === 'medium' ? 'secondary' : 'destructive'
                                  }>
                                    {question.difficulty}
                                  </Badge>
                                )}
                                {question.category && (
                                  <Badge variant="outline">{question.category}</Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={() => navigate('/assessments')}>
                Cancel
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button onClick={handlePublish}>
                  Publish Assessment
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateAssessment;
