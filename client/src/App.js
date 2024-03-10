import './App.css';
import Landing from './components/Landing';
import {Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Completeprofile from './components/Completeprofile';
import Apperr from './components/Apperr';
import Dashboard from './components/Dashboard';
import Createpost from './components/Createpost';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='login/' element={<Login/>}/>
        <Route path='signup/' element={<Signup/>}/>
        <Route path='completeprofile/' element={<Completeprofile/>}/>
        <Route path='error/' element={<Apperr/>}/>
        <Route path='dashboard/' element={<Dashboard/>}/>
        <Route path='createpost/' element={<Createpost/>}/>
      </Routes>
    </>
  );
}

export default App;
