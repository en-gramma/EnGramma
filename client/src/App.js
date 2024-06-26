import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Home} from './pages/Home'
import {Login} from './pages/Admin476'
import {Contact} from './pages/Contact'
import {PrivateRoute} from './components/PrivateRoute'
import { Dashboard } from './pages/Dashboard';
import {Navbar} from './components/Navbar';
import {Music} from './pages/Music';
import {Media} from './pages/Media';
import {Bio} from './pages/Bio';
import {Tour} from './pages/Tour';
import {Privacy} from './pages/Privacy';
import {ResetPasswordPage }from './pages/ResetPasswordPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { Unauthorized } from './pages/Unauthorized';
import { Footer } from './components/Footer';
import { useEffect, useState } from 'react';
import initializeI18n from '../src/components/translation/i18next';
import {Loader} from './components/Loader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for the i18n instance to initialize
    initializeI18n.then(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-auto '><Loader /></div>; 
  }

  return (
      <Router>
        <div className='flex flex-col h-screen'>
          <Navbar />
            <div className='flex-grow'> 
              <Routes>
                <Route element={<PrivateRoute roles={['admin', 'staff']} />}>
                  <Route  element={<Dashboard/>} path="/dashboard"/>
                </Route>
                <Route element={<Home />} path="/" exact/>
                <Route element={<Login />} path="/Admin476"/>
                <Route element={<ResetPasswordPage />} path="/reset-password"/>
                <Route element={<ForgotPassword />} path="/forgot-password"/>
                <Route element={<Music/>} path="/music"/>
                <Route element={<Media/>} path="/media"/>
                <Route element={<Bio/>} path="/bio"/>
                <Route element={<Tour/>} path="/tour"/>
                <Route element={<Contact/>} path="/contact"/>
                <Route element={<Privacy/>} path="/Privacy"/>
                <Route element={<Unauthorized/>} path="/unauthorized"/>
              </Routes>
            </div>
            <Footer />
        </div>
      </Router>
  );
}

export default App;