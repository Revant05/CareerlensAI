import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import { RoadmapList, RoadmapDetail } from './pages/roadmap';
import Profile from './pages/profile';
import ProfileAnalysis from './pages/profileanalysis';
import MockInterview from './pages/mockinterview';
import SkillEvaluation from './pages/skillevaluation';
import CertificateSuggestions from './pages/CertificateSuggestions';
import VideoCall from './pages/VideoCall';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileGuard from './components/ProfileGuard';

import StudentJobs from './pages/StudentJobs';
import StudentMessages from './pages/StudentMessages';
import RecruiterDashboard from './pages/recruiterdashboard';
import RecruiterJobs from './pages/recruiterjobs';
import RecruiterScan from './pages/recruiterscan';
import RecruiterMessages from './pages/recruitermessages';
import AdminDashboard from './pages/admindashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/recruiter-dashboard',
    element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute>,
  },
  {
    path: '/recruiter-jobs',
    element: <ProtectedRoute><RecruiterJobs /></ProtectedRoute>,
  },
  {
    path: '/recruiter-scan',
    element: <ProtectedRoute><RecruiterScan /></ProtectedRoute>,
  },
  {
    path: '/recruiter-messages',
    element: <ProtectedRoute><RecruiterMessages /></ProtectedRoute>,
  },
  {
    path: '/admin-dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/jobs',
    element: <ProtectedRoute><StudentJobs /></ProtectedRoute>,
  },
  {
    path: '/messages',
    element: <ProtectedRoute><StudentMessages /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: '/profile-analysis',
    element: <ProtectedRoute><ProfileGuard><ProfileAnalysis /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/mock-interview',
    element: <ProtectedRoute><ProfileGuard><MockInterview /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/skill-evaluation',
    element: <ProtectedRoute><ProfileGuard><SkillEvaluation /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/certificates',
    element: <ProtectedRoute><ProfileGuard><CertificateSuggestions /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/roadmap',
    element: <ProtectedRoute><ProfileGuard><RoadmapList /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/roadmap/:id',
    element: <ProtectedRoute><ProfileGuard><RoadmapDetail /></ProfileGuard></ProtectedRoute>,
  },
  {
    path: '/video-call/:roomId',
    element: <ProtectedRoute><VideoCall /></ProtectedRoute>,
  },
]);

export default router;