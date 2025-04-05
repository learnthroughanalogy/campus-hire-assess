
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Edit, Mail, Clock, Users, FileText, Copy, CalendarIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mock assessment data
const mockAssessment = {
  id: '1',
  title: 'Data Structures & Algorithms',
  description: 'Comprehensive assessment of data structures and algorithmic knowledge for campus recruitment.',
  date: '2025-04-10',
  status: 'scheduled',
  duration: 90,
  totalQuestions: 28,
  passScore: 70,
  sections: [
    {
      id: '1',
      name: 'Algorithms',
      duration: 30,
      questionCount: 10
    },
    {
      id: '2',
      name: 'Data Structures',
      duration: 30,
      questionCount: 10
    },
    {
      id: '3',
      name: 'Problem Solving',
      duration: 30,
      questionCount: 8
    }
  ],
  students: [
    { id: '1', name: 'John Student', email: 'john@example.com', status: 'invited' },
    { id: '2', name: 'Emma Wilson', email: 'emma@example.com', status: 'not_started' },
    { id: '3', name: 'Michael Johnson', email: 'michael@example.com', status: 'invited' },
    { id: '4', name: 'Sarah Brown', email: 'sarah@example.com', status: 'invited' },
    { id: '5', name: 'David Lee', email: 'david@example.com', status: 'declined' }
  ]
};

// Sample questions
const sampleQuestions = [
  {
    id: '1',
    text: 'What is the time complexity of binary search?',
    section: 'Algorithms',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1
  },
  {
    id: '2',
    text: 'Which data structure follows First In First Out (FIFO) principle?',
    section: 'Data Structures',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctAnswer: 1
  },
  {
    id: '3',
    text: 'Which approach is most efficient for detecting a cycle in a linked list?',
    section: 'Problem Solving',
    options: [
      'Use a hash set to track visited nodes',
      'Floyd\'s cycle-finding algorithm (tortoise and hare)',
      'Mark visited nodes',
      'Check all paths recursively'
    ],
    correctAnswer: 1
  }
];

const AssessmentDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, we'd fetch the assessment data based on the ID
  const assessment = mockAssessment;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'invited':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Invited</Badge>;
      case 'not_started':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Declined</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{assessment.title}</h1>
            <p className="text-muted-foreground">
              Assessment ID: {id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Invite Students
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Overview</CardTitle>
                <CardDescription>
                  Details about the assessment configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center p-4 border rounded-md">
                      <div className="mr-4 rounded-full bg-blue-100 p-3">
                        <CalendarIcon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Date</div>
                        <div className="font-medium">{new Date(assessment.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-md">
                      <div className="mr-4 rounded-full bg-emerald-100 p-3">
                        <Clock className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Total Duration</div>
                        <div className="font-medium">{assessment.duration} minutes</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-md">
                      <div className="mr-4 rounded-full bg-amber-100 p-3">
                        <FileText className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Questions</div>
                        <div className="font-medium">{assessment.totalQuestions} total</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-md">
                      <div className="mr-4 rounded-full bg-purple-100 p-3">
                        <Users className="h-6 w-6 text-purple-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Students</div>
                        <div className="font-medium">{assessment.students.length} invited</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {assessment.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Sections</h3>
                    <div className="space-y-2">
                      {assessment.sections.map((section) => (
                        <div key={section.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium">{section.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {section.questionCount} questions • {section.duration} minutes
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {Math.round((section.questionCount / assessment.totalQuestions) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="students" className="space-y-4">
              <TabsList>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Invited Students</CardTitle>
                      <CardDescription>
                        Students assigned to this assessment
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reminder
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessment.students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{getStatusBadge(student.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {assessment.students.length} students
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export List
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Assessment Questions</CardTitle>
                      <CardDescription>
                        Sample of questions from this assessment
                      </CardDescription>
                    </div>
                    <Button size="sm">View All Questions</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {sampleQuestions.map((question, index) => (
                        <div key={question.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">Question {index + 1}</div>
                              <div className="text-xs text-muted-foreground">Section: {question.section}</div>
                            </div>
                          </div>
                          <div className="mb-4">{question.text}</div>
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-md border ${
                                  idx === question.correctAnswer 
                                    ? 'border-emerald-500 bg-emerald-50' 
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                    idx === question.correctAnswer 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'bg-gray-100'
                                  }`}>
                                    {String.fromCharCode(65 + idx)}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Scheduled for {new Date(assessment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Student Responses</span>
                      <span>0/{assessment.students.length}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" className="w-full">Cancel Assessment</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" onClick={() => navigate('/results')}>
                  <Download className="mr-2 h-4 w-4" />
                  View Results
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Students
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AssessmentDetails;
