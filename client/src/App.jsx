import {Routes,Route} from 'react-router-dom';
import Login from './pages/template/Auth.jsx'
import MainPage from './pages/template/MainPage.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path = "/" element={<Login/>} />
        <Route path = "/home" element={<MainPage/>} />
      </Routes>
    </>
  )
}

export default App
