import React, { JSX, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../imagens/logo.png";
import { Menu as MenuIcon, X } from "lucide-react";

export const Menu = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClassName = (path: string) => {
    const isActive = location.pathname === path;
    return `relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
      isActive ? "text-[#E1FF01]" : "text-gray-300 hover:text-white"
    } before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-[#E1FF01] before:transform before:scale-x-0 before:origin-right before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left ${
      isActive ? "before:scale-x-100" : ""
    }`;
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={getLinkClassName("/")}>
              Início
            </Link>
            <Link to="/sobre" className={getLinkClassName("/sobre")}>
              Sobre
            </Link>
            <Link to="/planos" className={getLinkClassName("/planos")}>
              Planos
            </Link>
            <Link to="/contato" className={getLinkClassName("/contato")}>
              Contato
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/cadastro")}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
            >
              Cadastro
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium bg-[#E1FF01] text-gray-900 rounded-lg hover:bg-[#b8cc00] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Entrar
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-300"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-60 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-lg" />
        <div className="relative flex flex-col items-center justify-center h-full px-6">
          <div className="absolute top-6 right-6">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Link
            to="/"
            onClick={toggleMenu}
            className="block text-2xl text-gray-300 hover:text-white py-2 text-center"
          >
            Início
          </Link>
          <Link
            to="/sobre"
            onClick={toggleMenu}
            className="block text-2xl text-gray-300 hover:text-white py-2 text-center"
          >
            Sobre
          </Link>
          <Link
            to="/planos"
            onClick={toggleMenu}
            className="block text-2xl text-gray-300 hover:text-white py-2 text-center"
          >
            Planos
          </Link>
          <Link
            to="/contato"
            onClick={toggleMenu}
            className="block text-2xl text-gray-300 hover:text-white py-2 text-center"
          >
            Contato
          </Link>
          <div className="mt-8 w-full space-y-4">
            <button
              onClick={() => {
                navigate("/cadastro");
                toggleMenu();
              }}
              className="w-full px-6 py-3 text-lg text-gray-300 hover:text-white border border-gray-300 rounded-lg transition-colors duration-300"
            >
              Cadastro
            </button>
            <button
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
              className="w-full px-6 py-3 text-lg bg-[#E1FF01] text-gray-900 rounded-lg hover:bg-[#b8cc00] transition-all duration-300"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;


