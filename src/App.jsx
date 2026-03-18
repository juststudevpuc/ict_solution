import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/front/HomePage";
import AboutPage from "./pages/front/AboutPage";


export default function App(){
  
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path="about" element={<AboutPage/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}