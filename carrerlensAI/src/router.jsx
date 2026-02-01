import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import { RoadmapList, RoadmapDetail } from './pages/roadmap';
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
    path: '/roadmap',
    element: <ProtectedRoute><RoadmapList /></ProtectedRoute>,
  },
  {
    path: '/roadmap/:id',
    element: <ProtectedRoute><RoadmapDetail /></ProtectedRoute>,
  },
]);

export default router;