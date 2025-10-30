import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarDetailPage from './pages/CarDetailPage';
import ComparePage from './pages/ComparePage';
import AllCarsPage from './pages/AllCarsPage';
import ProfilePage from './pages/ProfilePageNew';
import AdminPage from './pages/AdminPage';
import CarFormPage from './pages/CarFormPage';
import PopularComparisonsPage from './pages/PopularComparisonsPage';
import ForumPage from './pages/ForumPage';
import ForumTopicPage from './pages/ForumTopicPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="App min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/cars" element={<AllCarsPage />} />
                      <Route path="/car/:id" element={<CarDetailPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/popular-comparisons" element={<PopularComparisonsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/admin/car/new" element={<CarFormPage />} />
                      <Route path="/admin/car/:carId" element={<CarFormPage />} />
                      <Route path="/forum" element={<ForumPage />} />
                      <Route path="/forum/:topicId" element={<ForumTopicPage />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
            </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;