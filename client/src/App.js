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


function App() {
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