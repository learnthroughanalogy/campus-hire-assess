
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Download, Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';

// Mock student data
const students = [
  { 
    id: '1', 
    name: 'John Student', 
    email: 'john@example.com', 
    college: 'Tech University',
    major: 'Computer Science',
    completedAssessments: 2,
    upcomingAssessments: 1,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Emma Wilson', 
    email: 'emma@example.com', 
    college: 'Engineering College',
    major: 'Software Engineering',
    completedAssessments: 1,
    upcomingAssessments: 2,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Michael Johnson', 
    email: 'michael@example.com', 
    college: 'Tech University',
    major: 'Information Technology',
    completedAssessments: 0,
    upcomingAssessments: 3,
    status: 'pending'
  },
  { 
    id: '4', 
    name: 'Sarah Brown', 
    email: 'sarah@example.com', 
    college: 'State University',
    major: 'Computer Engineering',
    completedAssessments: 3,
    upcomingAssessments: 0,
    status: 'active'
  },
  { 
    id: '5', 
    name: 'David Lee', 
    email: 'david@example.com', 
    college: 'Technical Institute',
    major: 'Artificial Intelligence',
    completedAssessments: 1,
    upcomingAssessments: 1,
    status: 'inactive'
  },
];

const StudentManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center text-emerald-600 bg-emerald-50 text-xs px-2 py-1 rounded-full"><CheckCircle2 className="h-3 w-3 mr-1" />Active</span>;
      case 'pending':
        return <span className="flex items-center text-amber-600 bg-amber-50 text-xs px-2 py-1 rounded-full"><Clock className="h-3 w-3 mr-1" />Pending</span>;
      case 'inactive':
        return <span className="flex items-center text-red-600 bg-red-50 text-xs px-2 py-1 rounded-full"><XCircle className="h-3 w-3 mr-1" />Inactive</span>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor student accounts and assessments
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
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
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Students</CardTitle>
                <CardDescription>
                  Manage all registered students in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.college}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell>{getStatusBadge(student.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm">
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Active Students</CardTitle>
                <CardDescription>
                  Students who are currently active in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter(student => student.status === 'active')
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.college}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm">
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Similar content for other tabs, omitted for brevity */}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StudentManagement;
