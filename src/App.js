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

function App() {
  return (
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;