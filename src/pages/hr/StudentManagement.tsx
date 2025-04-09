
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Download, Mail, CheckCircle2, XCircle, Clock, FileUp, Eye, Edit } from 'lucide-react';
import StudentImportDialog from '@/components/dialogs/StudentImportDialog';
import StudentViewDialog from '@/components/dialogs/StudentViewDialog';
import StudentEditDialog from '@/components/dialogs/StudentEditDialog';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
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

  const handleViewStudent = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const handleEditStudent = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setEditDialogOpen(true);
  };

  const handleEmailStudent = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleExportStudents = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    
    // Generate file and trigger download
    XLSX.writeFile(workbook, "student_data.xlsx");
    
    toast({
      title: "Export Successful",
      description: "Student data has been exported to Excel",
    });
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
            <Button onClick={() => setImportDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline" onClick={handleExportStudents}>
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
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEmailStudent(student.email)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditStudent(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleViewStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
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
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEmailStudent(student.email)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditStudent(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleViewStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
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
      
      <StudentImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />
      
      <StudentViewDialog 
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        student={selectedStudent}
      />
      
      <StudentEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        student={selectedStudent}
      />
    </AppLayout>
  );
};

export default StudentManagement;
