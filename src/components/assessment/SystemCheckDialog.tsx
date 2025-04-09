
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Camera, Cpu, Monitor, Mic, Wifi } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface SystemCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (success: boolean, studentImage?: string) => void;
}

interface SystemCheckResult {
  name: string;
  status: 'pending' | 'checking' | 'success' | 'fail';
  icon: React.ReactNode;
  message: string;
}

const SystemCheckDialog: React.FC<SystemCheckDialogProps> = ({ open, onOpenChange, onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'checking' | 'camera' | 'complete'>('checking');
  const [studentImage, setStudentImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [systemChecks, setSystemChecks] = useState<SystemCheckResult[]>([
    { name: 'Browser Compatibility', status: 'pending', icon: <Cpu className="h-4 w-4" />, message: 'Checking browser...' },
    { name: 'Screen Resolution', status: 'pending', icon: <Monitor className="h-4 w-4" />, message: 'Checking screen resolution...' },
    { name: 'Audio Device', status: 'pending', icon: <Mic className="h-4 w-4" />, message: 'Checking microphone...' },
    { name: 'Internet Connection', status: 'pending', icon: <Wifi className="h-4 w-4" />, message: 'Checking internet connection...' },
    { name: 'Camera Access', status: 'pending', icon: <Camera className="h-4 w-4" />, message: 'Checking camera...' },
  ]);

  // Perform system checks
  useEffect(() => {
    if (currentStep !== 'checking' || !open) return;
    
    const runChecks = async () => {
      // Check browser compatibility
      updateCheckStatus(0, 'checking');
      await simulateCheck();
      const isCompatibleBrowser = /Chrome|Firefox|Safari|Edge/.test(navigator.userAgent);
      updateCheckStatus(0, isCompatibleBrowser ? 'success' : 'fail');
      
      // Check screen resolution
      updateCheckStatus(1, 'checking');
      await simulateCheck();
      const hasMinResolution = window.innerWidth >= 1024 && window.innerHeight >= 768;
      updateCheckStatus(1, hasMinResolution ? 'success' : 'fail');
      
      // Check audio device
      updateCheckStatus(2, 'checking');
      try {
        await simulateCheck();
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.getTracks().forEach(track => track.stop());
        updateCheckStatus(2, 'success');
      } catch (error) {
        updateCheckStatus(2, 'fail');
      }
      
      // Check internet connection
      updateCheckStatus(3, 'checking');
      await simulateCheck();
      const hasGoodConnection = navigator.onLine;
      updateCheckStatus(3, hasGoodConnection ? 'success' : 'fail');
      
      // Check camera access
      updateCheckStatus(4, 'checking');
      try {
        await simulateCheck();
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream.getTracks().forEach(track => track.stop());
        updateCheckStatus(4, 'success');
      } catch (error) {
        updateCheckStatus(4, 'fail');
      }
    };
    
    runChecks();
  }, [currentStep, open]);
  
  // Helper function to update check status
  const updateCheckStatus = (index: number, status: 'pending' | 'checking' | 'success' | 'fail') => {
    setSystemChecks(prev => 
      prev.map((check, i) => 
        i === index 
          ? { 
              ...check, 
              status, 
              message: status === 'checking' 
                ? `Checking ${check.name.toLowerCase()}...` 
                : status === 'success' 
                  ? `${check.name} check passed` 
                  : `${check.name} check failed` 
            } 
          : check
      )
    );
  };
  
  // Helper function to simulate async check
  const simulateCheck = () => new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if all tests passed
  const allChecksPassed = systemChecks.every(check => check.status === 'success');
  
  // Handle proceeding to next step
  const handleProceedToCamera = () => {
    if (allChecksPassed) {
      setCurrentStep('camera');
      initializeCamera();
    } else {
      toast({
        title: "System check failed",
        description: "Please resolve the issues before proceeding.",
        variant: "destructive",
      });
    }
  };
  
  // Initialize camera for taking student's photo
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  };
  
  // Capture student's photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const imageData = canvasRef.current.toDataURL('image/png');
        setStudentImage(imageData);
      }
    }
  };
  
  // Complete the system check process
  const handleComplete = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    onComplete(true, studentImage || undefined);
    onOpenChange(false);
  };
  
  // Close dialog handler
  const handleCloseDialog = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'checking' ? 'System Check' : 
             currentStep === 'camera' ? 'Identity Verification' : 
             'Ready to Begin'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'checking' ? 'Verifying your system meets the requirements' : 
             currentStep === 'camera' ? 'Please allow us to take your photo for verification' : 
             'Your system is ready for the assessment'}
          </DialogDescription>
        </DialogHeader>
        
        {currentStep === 'checking' && (
          <div className="space-y-4 my-4">
            {systemChecks.map((check, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  check.status === 'success' ? 'border-green-200 bg-green-50' : 
                  check.status === 'fail' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`mr-3 ${
                    check.status === 'success' ? 'text-green-500' : 
                    check.status === 'fail' ? 'text-red-500' : 
                    check.status === 'checking' ? 'text-amber-500' : 'text-gray-400'
                  }`}>
                    {check.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{check.name}</div>
                    <div className="text-xs text-gray-500">{check.message}</div>
                  </div>
                </div>
                <div>
                  {check.status === 'pending' && <div className="w-4 h-4 bg-gray-200 rounded-full"></div>}
                  {check.status === 'checking' && (
                    <div className="w-4 h-4 rounded-full border-2 border-t-amber-500 border-r-amber-500 border-b-amber-200 border-l-amber-200 animate-spin"></div>
                  )}
                  {check.status === 'success' && <Check className="w-4 h-4 text-green-500" />}
                  {check.status === 'fail' && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            ))}
            
            {systemChecks.some(check => check.status === 'fail') && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>System Check Failed</AlertTitle>
                <AlertDescription>
                  Your system doesn't meet one or more requirements. Please fix the issues and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {currentStep === 'camera' && (
          <div className="space-y-4 my-4">
            <div className="relative border rounded-lg overflow-hidden bg-black">
              <video ref={videoRef} className="w-full h-auto" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            {studentImage && (
              <div className="border rounded-lg p-2 bg-gray-50">
                <p className="text-sm text-center mb-2">Captured Image</p>
                <img src={studentImage} alt="Student" className="max-h-[200px] mx-auto border" />
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          {currentStep === 'checking' && (
            <Button 
              onClick={handleProceedToCamera} 
              disabled={systemChecks.some(check => check.status === 'checking' || check.status === 'pending') || !allChecksPassed}
            >
              {systemChecks.some(check => check.status === 'checking' || check.status === 'pending')
                ? 'Checking...'
                : allChecksPassed ? 'Proceed to Camera Check' : 'Retry Checks'}
            </Button>
          )}
          
          {currentStep === 'camera' && (
            <>
              <Button variant="outline" onClick={capturePhoto} disabled={!!studentImage}>
                {studentImage ? 'Photo Captured' : 'Take Photo'}
              </Button>
              <Button onClick={handleComplete} disabled={!studentImage}>
                Begin Assessment
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SystemCheckDialog;
