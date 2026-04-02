import { BrowserRouter, Routes} from "react-router-dom";
import { renderRoutes } from "./routes/index.jsx";  

function App() {
  return (
    <BrowserRouter>
        <Routes>
            { renderRoutes() }
        </Routes>
    </BrowserRouter>
  )
}

export default App
