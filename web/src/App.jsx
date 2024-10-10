// Import
import AppRoute from "./routes/AppRouter";

// Import Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRoute />
    </div>

  )
}