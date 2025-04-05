
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BadgePlus, Download, BarChart3, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock result data
const assessmentOptions = [
  { id: '3', title: 'System Design' },
  { id: '4', title: 'Python Programming' }
];

const studentResults = [
  { id: '1', name: 'John Student', score: 85, duration: 75, flagged: false, status: 'passed' },
  { id: '2', name: 'Emma Wilson', score: 92, duration: 80, flagged: false, status: 'passed' },
  { id: '3', name: 'Michael Johnson', score: 78, duration: 85, flagged: false, status: 'passed' },
  { id: '4', name: 'Sarah Brown', score: 65, duration: 90, flagged: true, status: 'failed' },
  { id: '5', name: 'David Lee', score: 72, duration: 88, flagged: false, status: 'passed' }
];

const sectionPerformance = [
  { name: 'Architecture', avgScore: 85, highestScore: 95, lowestScore: 70 },
  { name: 'Scalability', avgScore: 75, highestScore: 90, lowestScore: 60 },
  { name: 'Design Patterns', avgScore: 82, highestScore: 95, lowestScore: 65 },
];

const questionStats = [
  { id: '1', text: 'What is the time complexity of binary search?', correctRate: 90, avgTime: 30 },
  { id: '2', text: 'Which sorting algorithm has the best average-case time complexity?', correctRate: 75, avgTime: 40 },
  { id: '3', text: 'What data structure is used for implementing priority queue?', correctRate: 65, avgTime: 45 }
];

const ResultsDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAssessment, setSelectedAssessment] = React.useState(assessmentOptions[0]?.id);
  
  const filteredResults = studentResults.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const averageScore = studentResults.reduce((sum, student) => sum + student.score, 0) / studentResults.length;
  const passRate = (studentResults.filter(student => student.status === 'passed').length / studentResults.length) * 100;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Results Dashboard</h1>
            <p className="text-muted-foreground">
              Analyze student performance across assessments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
            <Button>
              <BadgePlus className="mr-2 h-4 w-4" />
              New Score Entry
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select 
              value={selectedAssessment}
              onValueChange={setSelectedAssessment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessmentOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9 pr-4 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentResults.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed the assessment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pass Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Students who passed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Duration
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(studentResults.reduce((sum, item) => sum + item.duration, 0) / studentResults.length)} mins
              </div>
              <p className="text-xs text-muted-foreground">
                Time to complete
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="student-results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="student-results">Student Results</TabsTrigger>
            <TabsTrigger value="section-performance">Section Performance</TabsTrigger>
            <TabsTrigger value="question-analysis">Question Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student-results">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>
                  Individual student results for the selected assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Flagged</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.score}%</span>
                            <Progress value={result.score} className="w-14 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {result.status === 'passed' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                              Passed
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Failed
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{result.duration} mins</TableCell>
                        <TableCell>
                          {result.flagged ? (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                              Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="section-performance">
            <Card>
              <CardHeader>
                <CardTitle>Section Performance Analysis</CardTitle>
                <CardDescription>
                  Average performance by section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Highest Score</TableHead>
                      <TableHead>Lowest Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionPerformance.map((section) => (
                      <TableRow key={section.name}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{section.avgScore}%</span>
                            <Progress value={section.avgScore} className="w-20 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{section.highestScore}%</TableCell>
                        <TableCell>{section.lowestScore}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="question-analysis">
            <Card>
              <CardHeader>
                <CardTitle>Question Analysis</CardTitle>
                <CardDescription>
                  Performance analysis for individual questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Correct Response Rate</TableHead>
                      <TableHead>Avg. Time Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionStats.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.text}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{question.correctRate}%</span>
                            <Progress value={question.correctRate} className="w-20 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{question.avgTime} seconds</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ResultsDashboard;
