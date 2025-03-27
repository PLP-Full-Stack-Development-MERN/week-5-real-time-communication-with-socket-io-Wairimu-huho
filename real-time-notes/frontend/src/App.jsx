import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { NoteProvider } from './context/NoteContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            <NoteProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NoteProvider>
          </main>
          <ToastContainer position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;