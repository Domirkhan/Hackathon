import { BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import './index.css';

// Основные компоненты
import Review from './components/main/Review';
import SearchMain from './components/main/SearchMain';
import Test from './components/main/Test';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Courses from './components/main/Courses';
import Testing from './components/Test/Testing';

// Компоненты авторизации
import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider } from './context/AuthContext';

// Компоненты админ-панели
import JobsManagement from './pages/admin/JobsManagement';
import InternshipsManagement from './pages/admin/InternshipsManagement';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';

// Компоненты студента
import StudentDashboard from './pages/student/StudentDashboard';

// Защищенный маршрут
const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

// Компонент админ-панели
const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard">Панель управления</Link>
            </li>
            <li>
              <Link to="/admin/jobs">Управление вакансиями</Link>
            </li>
            <li>
              <Link to="/admin/internships">Управление стажировками</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={
          <main>
            <SearchMain />
            <Test />
            <Review />
            <Courses />
          </main>
        } />
        
        <Route path="/login" element={
          user ? (
            user.role === 'employer' ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Navigate to="/student/dashboard" replace />
          ) : (
            <Login />
          )
        } />
        
        <Route path="/register" element={<Register />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/courses" element={<Courses />} />

        {/* Маршруты для студента */}
        <Route path="/student/dashboard" element={
          <PrivateRoute 
            allowedRoles={['student']} 
            element={<StudentDashboard />}
          />
        } />

        {/* Маршруты для работодателя */}
        <Route path="/admin/*" element={
          <PrivateRoute 
            allowedRoles={['employer']} 
            element={
              <AdminLayout>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<EmployerDashboard />} />
                  <Route path="jobs" element={<JobsManagement />} />
                  <Route path="internships" element={<InternshipsManagement />} />
                </Routes>
              </AdminLayout>
            }
          />
        } />

        {/* Редиректы */}
        <Route path="/dashboard" element={
          user ? (
            user.role === 'employer' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Маршрут по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

// Корневой компонент с провайдером
export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}