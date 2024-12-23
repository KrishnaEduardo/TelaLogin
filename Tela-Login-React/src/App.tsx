import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TelaLogin } from './Components/TelaLogin/TelaLogin';
import { BoasVindas } from './Components/BoasVindas/BoasVindas';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <Router>
        <Toaster/>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/welcome" element={<BoasVindas />} />
      </Routes>
    </Router>
  );
}

export default App;
