
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, BarChart3, Shield, Award, Clock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative bg-emerald-700 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-emerald-900 to-emerald-700 pattern-dots"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 space-y-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-10 w-10 mr-3" />
                <h2 className="text-2xl font-bold">CampusHire</h2>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Streamlined Campus Assessment Platform
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                An intelligent assessment system designed for universities and recruiters to evaluate and hire top tech talent efficiently.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50" size="lg" onClick={() => navigate('/login')}>
                  Get Started
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-emerald-600" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-emerald-700 font-medium text-sm">Computer Science Assessment</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="text-emerald-800 font-medium mb-2">Section: Algorithms</h4>
                    <p className="text-sm text-emerald-700">Time remaining: 15:42</p>
                    <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-emerald-600 w-1/3 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">
                      What is the time complexity of the quicksort algorithm in its average case?
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center p-2 rounded border border-gray-200">
                        <div className="w-4 h-4 border border-gray-300 rounded-full mr-3"></div>
                        <span className="text-sm">O(n)</span>
                      </div>
                      <div className="flex items-center p-2 rounded border border-emerald-300 bg-emerald-50">
                        <div className="w-4 h-4 bg-emerald-600 rounded-full mr-3 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">O(n log n)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800">Assessment Platform Features</h2>
            <p className="mt-2 text-emerald-600">Designed for seamless evaluation of technical talent</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">AI-Based Proctoring</h3>
              <p className="text-gray-600">
                Advanced monitoring system that ensures assessment integrity by detecting fraudulent activities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Section-Based Timing</h3>
              <p className="text-gray-600">
                Customizable time limits for different sections to evaluate candidates thoroughly in various skills.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-600">
                Detailed reports and insights to help HR teams make data-driven hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800">How It Works</h2>
            <p className="mt-2 text-emerald-600">Simple process for both HR and students</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 -mt-2 -ml-2 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div className="rounded-lg bg-emerald-50 p-6 pt-10 h-full">
                <h3 className="font-semibold text-lg text-emerald-800 mb-3">Setup by HR</h3>
                <p className="text-gray-600">
                  HR teams upload student details and assessment questions, set section timings, and schedule tests.
                </p>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 -mt-2 -ml-2 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div className="rounded-lg bg-emerald-50 p-6 pt-10 h-full">
                <h3 className="font-semibold text-lg text-emerald-800 mb-3">Student Verification</h3>
                <p className="text-gray-600">
                  Students login, verify their personal details, and get ready for the assessment.
                </p>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 -mt-2 -ml-2 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div className="rounded-lg bg-emerald-50 p-6 pt-10 h-full">
                <h3 className="font-semibold text-lg text-emerald-800 mb-3">Proctored Assessment</h3>
                <p className="text-gray-600">
                  Students take section-wise timed assessments while the system monitors for integrity.
                </p>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 -mt-2 -ml-2 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div className="rounded-lg bg-emerald-50 p-6 pt-10 h-full">
                <h3 className="font-semibold text-lg text-emerald-800 mb-3">Results & Analysis</h3>
                <p className="text-gray-600">
                  HR teams review performance, analyze results, and make informed hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your campus hiring?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join universities and companies already using CampusHire to find the best technical talent.
          </p>
          <Button 
            className="bg-white text-emerald-700 hover:bg-emerald-50" 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8" />
                <span className="text-xl font-bold">CampusHire</span>
              </div>
              <p className="mt-2 text-emerald-200 max-w-xs">
                Helping colleges and companies find the perfect match through intelligent assessments.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-emerald-200">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Testimonials</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-emerald-200">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-emerald-200">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 mt-8 pt-6 text-center text-emerald-300 text-sm">
            <p>&copy; {new Date().getFullYear()} CampusHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
