'use client'
 
import { createContext, useContext, useState } from 'react'
 
export const Context = createContext([])
 
export function ThemeProvider({ children }) {
    const [suppliers, updateSuppliers] = useState([]);

    return <Context.Provider value={[suppliers, updateSuppliers]}>{children}</Context.Provider>
}

export function useThemeContext() {
    return useContext(Context);
}
