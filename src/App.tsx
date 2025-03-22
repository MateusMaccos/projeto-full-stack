import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Components/Routes/Routes"; // Ajuste o caminho se necessário

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
