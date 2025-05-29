import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './src/components/main/Courses';
import './App.css';
import Review from './components/main/Review';
import SearchMain from './components/main/SearchMain';
import Test from './components/main/Test';
import './index.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider } from './context/AuthContext';
import Courses from './src/components/main/Courses';


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app">
        <Header />
        <Routes>
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
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;