
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Monitor, Shield, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MonitoringScreenProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  screenVideoRef: React.RefObject<HTMLVideoElement>;
  webRTCStatus: 'disconnected' | 'connecting' | 'connected' | 'failed';
  suspiciousActivities: Array<{
    timestamp: Date | string;
    type: string;
    details: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

const MonitoringScreen: React.FC<MonitoringScreenProps> = ({
  videoRef,
  screenVideoRef,
  webRTCStatus,
  suspiciousActivities,
}) => {
  const latestActivity = suspiciousActivities.length > 0 ? suspiciousActivities[suspiciousActivities.length - 1] : null;

  return (
    <div className="fixed top-4 right-4 w-[300px] space-y-4 z-50">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Proctoring Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4" />
              <span>Webcam Feed</span>
              <div className={`ml-auto h-2 w-2 rounded-full ${videoRef.current ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4" />
              <span>Screen Share</span>
              <div className={`ml-auto h-2 w-2 rounded-full ${screenVideoRef.current ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="h-4 w-4" />
              <span>Proctor Connection</span>
              <div 
                className={`ml-auto h-2 w-2 rounded-full ${
                  webRTCStatus === 'connected' ? 'bg-green-500' : 
                  webRTCStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg border border-border shadow-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {!videoRef.current && (
            <div className="text-destructive">
              <Camera className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs text-center">Camera not available</p>
            </div>
          )}
        </div>
      </div>

      {latestActivity && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs mt-1">
            {latestActivity.details}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MonitoringScreen;
