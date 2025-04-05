
import React, { useState, ChangeEvent } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileUp, FileQuestion, CheckCircle, FileText, Info, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const ImportQuestions: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is a .xlsx or .csv
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a .xlsx or .csv file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadProgress(0);
      setUploadComplete(false);
      setValidationStatus('idle');
      setValidationMessages([]);
    }
  };
  
  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        setValidationStatus('validating');
        
        // Simulate validation after upload
        setTimeout(() => {
          // For demo purposes, we'll pretend there was an error in the spreadsheet
          setValidationStatus('error');
          setValidationMessages([
            "Row 15: Missing correct answer option",
            "Row 23: Question text is empty",
            "Row 42: Must have at least 2 answer options"
          ]);
          
          toast({
            title: "Validation failed",
            description: "There are issues with the uploaded file that need to be fixed.",
            variant: "destructive"
          });
        }, 2000);
      }
    }, 200);
  };
  
  const handleTryAgain = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setValidationStatus('idle');
    setValidationMessages([]);
  };
  
  const renderUploadState = () => {
    if (isUploading) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      );
    }
    
    if (uploadComplete) {
      if (validationStatus === 'validating') {
        return (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-opacity-50 border-t-emerald-600 rounded-full" />
            <span className="ml-3 text-sm">Validating questions...</span>
          </div>
        );
      }
      
      if (validationStatus === 'error') {
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Failed</AlertTitle>
              <AlertDescription>
                Please fix the following issues in your spreadsheet and upload again.
              </AlertDescription>
            </Alert>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="font-medium text-red-800 mb-2">Issues found:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {validationMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
            
            <Button onClick={handleTryAgain} className="w-full">
              Try Again
            </Button>
          </div>
        );
      }
      
      return (
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
          <p className="font-medium">Upload Successful!</p>
          <Button onClick={() => navigate('/assessments/create')} className="w-full">
            Create Assessment With These Questions
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => document.getElementById('file-upload')?.click()}>
          <div className="text-center">
            <FileUp className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <div className="text-sm font-medium">
              {file ? file.name : 'Click to upload or drag and drop'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              XLSX or CSV (max 10MB)
            </p>
          </div>
          <Input 
            id="file-upload" 
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.csv"
            className="hidden"
          />
        </div>
        
        {file && (
          <Button onClick={handleUpload} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Questions</h1>
          <p className="text-muted-foreground">
            Upload question sets from Excel or CSV files
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Question File</CardTitle>
              <CardDescription>
                Import questions from a spreadsheet file
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUploadState()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Template & Instructions</CardTitle>
              <CardDescription>
                Download templates and learn how to format your files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>File Format</AlertTitle>
                <AlertDescription>
                  Make sure your file follows the required format to avoid validation errors.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Excel Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
              </div>
              
              <div className="border rounded-md p-4 space-y-2">
                <h3 className="font-medium">Required Columns:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Question Text (required)</li>
                  <li>• Section Name (required)</li>
                  <li>• Option A (required)</li>
                  <li>• Option B (required)</li>
                  <li>• Option C (optional)</li>
                  <li>• Option D (optional)</li>
                  <li>• Correct Answer (required, A/B/C/D)</li>
                  <li>• Difficulty (optional: Easy/Medium/Hard)</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/assessments')}>
                <FileQuestion className="mr-2 h-4 w-4" />
                View All Questions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ImportQuestions;
