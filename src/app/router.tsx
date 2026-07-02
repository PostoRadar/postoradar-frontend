import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/home/HomePage';
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
      { index: true, element: <HomePage /> },
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
