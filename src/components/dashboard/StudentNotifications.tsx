
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';

const StudentNotifications: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Information</CardTitle>
        <CardDescription>
          Updates and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please verify your profile information before taking your next assessment.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-emerald-700">
                  Your Data Structures & Algorithms assessment is scheduled for April 10, 2025.
                </p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/profile')}
          >
            Review Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentNotifications;
