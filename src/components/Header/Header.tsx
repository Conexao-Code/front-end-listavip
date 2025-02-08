import React, { JSX, useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";
import claro from "../../imagens/claro.png";
import escuro from "../../imagens/escuro.png";
import { IoSearch } from "react-icons/io5";

export const Header = (): JSX.Element => {
    const { theme, toggleTheme } = useTheme();
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getHeaderWidth = () => {
        if (width <= 390) {
            return "86%"; 
        } else if (width <= 768) {
            return "calc(100% - 90px)";
        } else {
            return "calc(100% - 210px)"; 
        }
    };

    const getHeaderLeft = () => {
        if (width <= 390) {
            return "12%"; 
        } else if (width <= 768) {
            return "90px";
        } else {
            return "210px";
        }
    };

    return (
        <header
            className="flex items-center gap-4 px-4 py-2 fixed top-0 bg-transparent z-50"
            style={{
                width: getHeaderWidth(),
                left: getHeaderLeft(),
            }}
        >
            <div className="flex items-center gap-4">
            </div>
            <img
                className="w-10 h-10 cursor-pointer hover:opacity-75 transition-opacity ml-auto"
                alt="Tema"
                src={theme === "dark" ? escuro : claro}
                onClick={toggleTheme}
            />
        </header>
    );
};
