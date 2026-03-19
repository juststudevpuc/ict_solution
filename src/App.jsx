import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/front/HomePage";
import AboutPage from "./pages/front/AboutPage";
import ServicePage from "./pages/front/ServicePage";


export default function App(){
  
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path="about" element={<AboutPage/>}/>
          <Route path="service" element={<ServicePage/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}