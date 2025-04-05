
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Clock, CheckCircle, FileUp, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Mock assessments data
const assessments = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    date: '2025-04-10',
    status: 'scheduled',
    students: 45,
    duration: 90,
    sections: ['Algorithms', 'Data Structures', 'Problem Solving']
  },
  {
    id: '2',
    title: 'Full Stack Development',
    date: '2025-04-15',
    status: 'scheduled',
    students: 30,
    duration: 120,
    sections: ['Frontend', 'Backend', 'Databases', 'APIs']
  },
  {
    id: '3',
    title: 'System Design',
    date: '2025-04-05',
    status: 'completed',
    students: 25,
    duration: 60,
    sections: ['Architecture', 'Scalability', 'Design Patterns'],
    averageScore: 82.5
  },
  {
    id: '4',
    title: 'Python Programming',
    date: '2025-04-02',
    status: 'completed',
    students: 35,
    duration: 75,
    sections: ['Basics', 'OOP', 'Standard Library', 'Data Science'],
    averageScore: 78.3
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    date: '2025-04-20',
    status: 'draft',
    students: 0,
    duration: 120,
    sections: ['Statistics', 'Algorithms', 'Data Preparation', 'Model Evaluation']
  }
];

const AssessmentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200"><AlertTriangle className="h-3 w-3 mr-1" /> Draft</Badge>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessment Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and monitor assessments
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/assessments/import')}>
              <FileUp className="mr-2 h-4 w-4" />
              Import Questions
            </Button>
            <Button onClick={() => navigate('/assessments/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className="pl-9 pr-4 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Assessments</CardTitle>
                <CardDescription>
                  Manage all assessments in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Sections</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.length > 0 ? (
                      filteredAssessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">{assessment.title}</TableCell>
                          <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                          <TableCell>{assessment.students}</TableCell>
                          <TableCell>{assessment.duration} mins</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {assessment.sections.slice(0, 2).map((section, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded"
                                >
                                  {section}
                                </span>
                              ))}
                              {assessment.sections.length > 2 && (
                                <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded">
                                  +{assessment.sections.length - 2}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/assessments/${assessment.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No assessments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tabs for other status types would be similar - omitted for brevity */}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AssessmentManagement;
