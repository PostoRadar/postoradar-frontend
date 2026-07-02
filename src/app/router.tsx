import { createBrowserRouter } from 'react-router-dom';
import { BuscarPage } from '../pages/buscar/BuscarPage';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/login/LoginPage';
import { PostoDetailPage } from '../pages/posto-detail/PostoDetailPage';
import { PostoNewPage } from '../pages/posto-new/PostoNewPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { ProtectedRoute } from '../shared/routes/ProtectedRoute';
import { AppLayout } from './AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'buscar', element: <BuscarPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      { path: 'postos/:id', element: <PostoDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'postos/novo', element: <PostoNewPage /> }],
      },
    ],
  },
]);
