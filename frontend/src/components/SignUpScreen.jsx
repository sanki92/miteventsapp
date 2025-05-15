import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Selector from './common/Selector';
import { useState } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

// SignUp Component using Selector
export default function SignUpScreen() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    enrollmentNo: '',
    department: 'it',
    academicYear: 'sy'
  });
  
  // UI state
  const [college, setCollege] = useState('computing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const collegeOptions = [
    { value: 'computing', label: 'School Of Computing' },
    { value: 'engineering', label: 'School of Engineering' },
    { value: 'science', label: 'School of Science' }
  ];

  const departmentOptions = [
    { value: 'it', label: 'Information Technology' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'ai', label: 'Artificial Intelligence' }
  ];

  const yearOptions = [
    { value: 'fy', label: 'FY' },
    { value: 'sy', label: 'SY' },
    { value: 'ty', label: 'TY' },
    { value: 'ly', label: 'LY' }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Map department value to actual department name
  const getDepartmentName = (deptValue) => {
    const dept = departmentOptions.find(d => d.value === deptValue);
    return dept ? dept.label : deptValue;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.password || !formData.enrollmentNo) {
      setError('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data according to API requirements
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        enrollmentNo: formData.enrollmentNo,
        department: getDepartmentName(formData.department),
        academicYear: formData.academicYear.toUpperCase()
      };
      
      console.log('Sending registration data:', registrationData);
      
      // Call the register API
      const response = await AuthService.register(registrationData);
      
      setSuccess('Account created successfully!');
      console.log('Registration successful:', response.data);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-medium text-center mb-8">Let's Get You Started!</h1>
          
          {/* Form with onSubmit handler */}
          <form onSubmit={handleSubmit}>
            {/* Error/Success messages */}
            {error && (
              <div className="bg-red-500/50 text-white p-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/50 text-white p-3 rounded mb-4">
                {success}
              </div>
            )}
            
            {/* Personal Information */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-black/30 border-0 text-white h-14"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black/30 border-0 text-white h-14"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact No.</Label>
                  <Input 
                    id="contactNo" 
                    value={formData.contactNo}
                    onChange={handleChange}
                    className="bg-black/30 border-0 text-white h-14"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-black/30 border-0 text-white h-14"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`bg-black/30 border-0 text-white h-14 ${
                      formData.password && formData.confirmPassword && 
                      formData.password !== formData.confirmPassword 
                        ? 'border-red-500' 
                        : ''
                    }`}
                  />
                  {formData.password && formData.confirmPassword && 
                   formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-sm">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* College Information */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h2 className="text-xl mb-4">College Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNo">Enrollment No.</Label>
                  <Input 
                    id="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleChange}
                    className="bg-black/30 border-0 text-white h-14"
                  />
                </div>
                
                <Selector 
                  label="College"
                  data={collegeOptions}
                  selected={college}
                  setSelected={setCollege}
                  placeholder="Select college"
                />
                
                <Selector 
                  label="Department"
                  data={departmentOptions}
                  selected={formData.department}
                  setSelected={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  placeholder="Select department"
                />
                
                <Selector 
                  label="Academic Year"
                  data={yearOptions}
                  selected={formData.academicYear}
                  setSelected={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
                  placeholder="Select year"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 bg-purple-700 hover:bg-purple-800"
              disabled={loading}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm">
              Been here before? <a href="/login" className="underline">Log In</a>
            </p>
            <p className="text-sm">
              Register Club?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};