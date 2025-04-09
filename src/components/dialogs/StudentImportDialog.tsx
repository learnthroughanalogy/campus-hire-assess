
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StudentImportDialog: React.FC<StudentImportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel' || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        e.target.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    // In a real application, this would download an actual Excel template
    toast({
      title: "Template downloaded",
      description: "Student import template has been downloaded",
    });
  };

  const handleImport = () => {
    if (file) {
      // In a real application, this would process the Excel file with a backend
      toast({
        title: "Students imported",
        description: `Successfully processed ${file.name}`,
      });
      
      setFile(null);
      onOpenChange(false);
    } else {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to import",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Students from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing student information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Excel File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              {file && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex items-center text-sm">
            <p className="text-muted-foreground">
              Need a template?{" "}
              <Button variant="link" className="h-auto p-0" onClick={handleDownloadTemplate}>
                Download template file
              </Button>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" />
            Import Students
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentImportDialog;
