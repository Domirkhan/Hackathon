import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Testing from './components/Test/Testing';

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
            </main>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/testing" element={<Testing />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;