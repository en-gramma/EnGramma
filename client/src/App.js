import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Home} from './pages/Home'
import {Login} from './pages/Login'
import {Contact} from './pages/Contact'
import {PrivateRoute} from './components/PrivateRoute'
import { Dashboard } from './pages/Dashboard';
import {Navbar} from './components/Navbar';
import {Music} from './pages/Music';
import {Media} from './pages/Media';
import {Bio} from './pages/Bio';
import {Tour} from './pages/Tour';
import {ResetPasswordPage }from './pages/ResetPasswordPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { Unauthorized } from './pages/Unauthorized';


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
                <Route element={<Login />} path="/login"/>
                <Route element={<ResetPasswordPage />} path="/reset-password"/>
                <Route element={<ForgotPassword />} path="/forgot-password"/>
                <Route element={<Music/>} path="/music"/>
                <Route element={<Media/>} path="/media"/>
                <Route element={<Bio/>} path="/bio"/>
                <Route element={<Tour/>} path="/tour"/>
                <Route element={<Contact/>} path="/contact"/>
                <Route element={<Unauthorized/>} path="/unauthorized"/>
              </Routes>
            </div>
        </div>
      </Router>
  );
}

export default App;