import  "../styles/Navbar.css"
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  return (
    
    <nav className="navbar__wrapper">
      <div className="navbar-title__wrapper">
        <span className="navbar-title__logo">Ω</span>
        <h1 className="navbar-title__title">Omeguitas</h1>
      </div>
      <span className="navbar__home"><FiHome onClick={() => navigate("/admin")}/></span>
      {/* <ul className="navbar__links">
        <li><a >Panel de administración</a></li>
        <li><a >Unidades navigate()</a></li>
        <li><a >Reservas</a></li>
        <li><a >Admins</a></li>
      </ul> */}
    </nav>
    
  );
} 

export default Navbar;