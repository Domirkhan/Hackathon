import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './src/components/main/Courses';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import './index.css';

// Основные компоненты
import Review from './components/main/Review';
import SearchMain from './components/main/SearchMain';
import Test from './components/main/Test';
import Header from './layout/Header';
import Footer from './layout/Footer';

// Компоненты авторизации
import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider } from './context/AuthContext';
import Courses from './src/components/main/Courses';



// Компоненты админ-панели
import JobsManagement from './pages/admin/JobsManagement';
import InternshipsManagement from './pages/admin/InternshipsManagement';

// Защищенный маршрут
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Компонент админ-панели
const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li>
              <a href="/admin/jobs">Управление вакансиями</a>
            </li>
            <li>
              <a href="/admin/internships">Управление стажировками</a>
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
    <Router>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />

          {/* Защищенные маршруты для работодателя */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['employer']}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route path="jobs" element={
              <PrivateRoute allowedRoles={['employer']}>
                <JobsManagement />
              </PrivateRoute>
            } />
            <Route path="internships" element={
              <PrivateRoute allowedRoles={['employer']}>
                <InternshipsManagement />
              </PrivateRoute>
            } />
          </Route>

          {/* Редирект с /admin на /admin/jobs */}
          <Route path="/admin" element={
            <Navigate to="/admin/jobs" replace />
          } />

          {/* Маршрут по умолчанию */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}