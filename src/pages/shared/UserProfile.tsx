import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Key, Shield, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const UserProfile: React.FC = () => {
  const { profile, isRecruiter } = useAuth();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: '555-123-4567',
    college: isRecruiter ? 'HR Department' : 'Tech University',
    department: isRecruiter ? 'Recruitment' : 'Computer Science',
    year: isRecruiter ? 'N/A' : '4th Year',
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assessmentReminders: true,
    resultNotifications: true,
    marketingEmails: false,
  });
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password should be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const handleNotificationUpdate = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and academic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-medium">{profile?.name || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role === 'recruiter' || profile?.role === 'hr' ? 'HR Manager' : 'Student'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college">{isRecruiter ? 'Department' : 'College/University'}</Label>
                      <Input 
                        id="college" 
                        value={userData.college}
                        onChange={(e) => setUserData({...userData, college: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">{isRecruiter ? 'Role' : 'Department/Major'}</Label>
                      <Input 
                        id="department" 
                        value={userData.department}
                        onChange={(e) => setUserData({...userData, department: e.target.value})}
                      />
                    </div>
                    {!isRecruiter && (
                      <div className="space-y-2">
                        <Label htmlFor="year">Year/Semester</Label>
                        <Input 
                          id="year" 
                          value={userData.year}
                          onChange={(e) => setUserData({...userData, year: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and manage account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-medium">Account Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your password and security settings
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-md">
                      <div>
                        <p className="font-medium">Current session</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full h-fit">
                        Active
                      </div>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-md">
                      <div>
                        <p className="font-medium">Previous login</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Date.now() - 86400000).toLocaleDateString()} at {new Date(Date.now() - 86400000).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded-full h-fit">
                        Expired
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-800">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-medium">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Control when and how you receive notifications
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="assessment-reminders" className="text-base">Assessment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders about upcoming assessments
                      </p>
                    </div>
                    <Switch 
                      id="assessment-reminders" 
                      checked={notificationSettings.assessmentReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate('assessmentReminders', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="result-notifications" className="text-base">Result Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when assessment results are available
                      </p>
                    </div>
                    <Switch 
                      id="result-notifications" 
                      checked={notificationSettings.resultNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('resultNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive news, updates, and promotional content
                      </p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default UserProfile;
