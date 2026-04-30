import { createContext } from "react";
import type { Recipe } from "./api/schemas";


export const AuthContext = createContext<
  {isLogin: boolean; setIsLogin: (isLogin: boolean) => void} | null
>(null);

export const BasketContext = createContext<
  {basketRecipes: Recipe[]; setBasketRecipes: (basketRecipes: Recipe[]) => void} | null
>(null);

export const BasketChangesContext = createContext<
  {basketChanges: number; setBasketChanges: (basketChanges: number) => void} | null
>(null);

export type BasketContextType = {
  basketRecipes: Recipe[]
  setBasketRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>
}

export const PurchasedRecipesContext = createContext<
  {purchasedRecipes: Recipe[]; setPurchasedRecipes: (purchasedRecipes: Recipe[]) => void} | null
>(null);

export const PurchasedChangesContext = createContext<
  {purchasedChanges: number; setPurchasedChanges: (purchasedChanges: number) => void} | null
>(null);
