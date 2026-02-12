import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import { RoadmapList, RoadmapDetail } from './pages/roadmap';
import Profile from './pages/profile';
import ProfileAnalysis from './pages/profileanalysis';
import MockInterview from './pages/mockinterview';
import SkillEvaluation from './pages/skillevaluation';
import ProtectedRoute from './components/ProtectedRoute';

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
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: '/profile-analysis',
    element: <ProtectedRoute><ProfileAnalysis /></ProtectedRoute>,
  },
  {
    path: '/mock-interview',
    element: <ProtectedRoute><MockInterview /></ProtectedRoute>,
  },
  {
    path: '/skill-evaluation',
    element: <ProtectedRoute><SkillEvaluation /></ProtectedRoute>,
  },
  {
    path: '/roadmap',
    element: <ProtectedRoute><RoadmapList /></ProtectedRoute>,
  },
  {
    path: '/roadmap/:id',
    element: <ProtectedRoute><RoadmapDetail /></ProtectedRoute>,
  },
]);

export default router;