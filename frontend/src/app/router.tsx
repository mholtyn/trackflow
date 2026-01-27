import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'


export const router = createBrowserRouter([
{
    path: '/',
    element: <LoginPage />,
},
{
    path: '/register',
    element: <RegisterPage />
},
])