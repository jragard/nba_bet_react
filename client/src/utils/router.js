import { useContext, createContext } from 'react';
// import { useContext } from "react";
// import { __RouterContext } from "react-router";

export const useRouter = () => {
    return useContext(createContext());
}