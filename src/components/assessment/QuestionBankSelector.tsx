
import React, { useState, useEffect } from 'react';
import { Search, Filter, Book, PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface QuestionType {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'coding' | 'subjective' | 'personality';
}

interface QuestionBankSelectorProps {
  onAddQuestion: (question: QuestionType) => void;
}

// Mock data for the question bank
const MOCK_QUESTIONS: QuestionType[] = [
  {
    id: '1',
    text: 'What is the output of console.log(1 + "2") in JavaScript?',
    options: ['3', '"12"', 'Error', 'undefined'],
    correctAnswer: 1,
    category: 'technical',
    difficulty: 'easy',
    type: 'multiple-choice'
  },
  {
    id: '2',
    text: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Stack', 'LinkedList', 'Array'],
    correctAnswer: 1,
    category: 'technical',
    difficulty: 'easy',
    type: 'multiple-choice'
  },
  {
    id: '3',
    text: 'If a train travels at 60 km/h and covers a distance in 3 hours, how far did it travel?',
    options: ['160 km', '180 km', '200 km', '220 km'],
    correctAnswer: 1,
    category: 'quantitative',
    difficulty: 'medium',
    type: 'multiple-choice'
  },
  {
    id: '4',
    text: 'Choose the word most opposite in meaning to "Enigmatic"',
    options: ['Mysterious', 'Clear', 'Puzzling', 'Complex'],
    correctAnswer: 1,
    category: 'verbal',
    difficulty: 'hard',
    type: 'multiple-choice'
  },
  {
    id: '5',
    text: 'Implement a function to reverse a string without using built-in reverse methods.',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: 'problem-solving',
    difficulty: 'medium',
    type: 'coding'
  },
  {
    id: '6',
    text: 'I prefer working in teams rather than independently.',
    options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    correctAnswer: 0,
    category: 'personality',
    difficulty: 'easy',
    type: 'personality'
  },
  {
    id: '7',
    text: 'Describe a challenging situation you faced and how you overcame it.',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: 'logical-reasoning',
    difficulty: 'hard',
    type: 'subjective'
  },
];

const QuestionBankSelector: React.FC<QuestionBankSelectorProps> = ({ onAddQuestion }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(MOCK_QUESTIONS);
  
  // Filter questions based on search query and filters
  useEffect(() => {
    let result = MOCK_QUESTIONS;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(q => 
        q.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(q => q.category === selectedCategory);
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(q => q.type === selectedType);
    }
    
    setFilteredQuestions(result);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedType]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="text-gray-400" size={18} />
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="quantitative">Quantitative</SelectItem>
            <SelectItem value="verbal">Verbal</SelectItem>
            <SelectItem value="logical-reasoning">Logical Reasoning</SelectItem>
            <SelectItem value="problem-solving">Problem Solving</SelectItem>
            <SelectItem value="personality">Personality</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="subjective">Subjective</SelectItem>
            <SelectItem value="personality">Personality</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-4 space-y-2">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions match your filters
            </div>
          ) : (
            filteredQuestions.map(question => (
              <Card key={question.id} className="hover:bg-slate-50 cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{question.text}</p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant={question.difficulty === 'easy' ? 'outline' : 
                                        question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge variant="outline">{question.type}</Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onAddQuestion(question)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuestionBankSelector;
