
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  completedAssessments: number;
  upcomingAssessments: number;
  status: string;
}

interface StudentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

const StudentViewDialog: React.FC<StudentViewDialogProps> = ({
  open,
  onOpenChange,
  student,
}) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            View detailed information about {student.name}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base">{student.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{student.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">College</h3>
              <p className="text-base">{student.college}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Major</h3>
              <p className="text-base">{student.major}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-base capitalize">{student.status}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Assessment Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{student.completedAssessments}</span>
                <span className="text-xs text-muted-foreground">Completed Assessments</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{student.upcomingAssessments}</span>
                <span className="text-xs text-muted-foreground">Upcoming Assessments</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => window.location.href = `mailto:${student.email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentViewDialog;
