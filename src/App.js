import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Основные компоненты
import Review from './components/main/Review';
import SearchMain from './components/main/SearchMain';
import Test from './components/main/Test';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Courses from './components/main/Courses';
import CourseDetails from './components/courses/CourseDetails';
import Lessons from './pages/Course/lessons';

// Компоненты авторизации
import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider } from './context/AuthContext';

// Компоненты вакансий
import JobsList from './pages/jobs/JobsList';
import JobDetails from './pages/jobs/JobDetails';
import UserProfile from './pages/profile/UserProfile';
import Testing from './components/Test/Testing';

// Защищенный маршрут
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  // Проверяем авторизацию и роль
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" />;
  }

  return children;
};
function App() {
  const { user } = useAuth();

  const getHomeRedirect = () => {
    return (
      <main>
        <SearchMain />
        <Test />
        <Review />
        <Courses />
      </main>
    );
  };

  return (
    <div className="app">
      <Header />
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={getHomeRedirect()} />
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          } 
        />

        {/* Общедоступные маршруты */}
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/lessons/:courseId" element={<Lessons />} />

        {/* Защищенные маршруты */}
         <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['student', 'employer']}>
              <UserProfile />
            </PrivateRoute>
          }
        />

        {/* Маршрут по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

// Обертка с провайдером авторизации
export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}