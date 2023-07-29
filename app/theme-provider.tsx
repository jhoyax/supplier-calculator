'use client'
 
import { createContext, useContext, useState } from 'react'
import {Suppliers} from './lib/interfaces'

type Props = React.PropsWithChildren<{}>;
 
export const Context = createContext<{
    suppliers: Suppliers, 
    updateSuppliers: (newValue: Suppliers) => void
}>({
    suppliers: [], 
    updateSuppliers: () => undefined
})
 
export function ThemeProvider({ children }: Props) {
    const [suppliers, updateSuppliers] = useState<Suppliers>([]);

    return <Context.Provider value={{suppliers, updateSuppliers}}>{children}</Context.Provider>
}

export function useThemeContext(): {
    suppliers: Suppliers, 
    updateSuppliers: (newValue: Suppliers) => void
} {
    return useContext(Context);
}
