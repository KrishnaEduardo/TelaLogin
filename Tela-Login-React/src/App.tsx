import { RouterProvider } from "react-router-dom"; 
import { Toaster } from 'react-hot-toast';
import { router } from './Components/Routes/Routes';


function App() {
  return (
      <>
          <Toaster />
          <RouterProvider router={router} />
      </>
  );
}

export default App;
