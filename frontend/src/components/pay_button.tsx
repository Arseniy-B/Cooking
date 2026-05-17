import type { Recipe } from "@/services/api/schemas";
import { buy_recipe } from "@/services/api/handlers";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PurchasedChangesContext, PurchasedRecipesContext, BasketContext, UserDataContext } from "@/services/contexts";
import { toast } from "sonner"


interface BuyRecipeButton {
  recipe: Recipe
  variant: "secondary" | "ghost" | "default";
  children: React.ReactNode;
}

export default function BuyRecipeButton({recipe, variant, children}: BuyRecipeButton) {
  const {purchasedChanges, setPurchasedChanges} = useContext(PurchasedChangesContext)!;
  const {purchasedRecipes, setPurchasedRecipes} = useContext(PurchasedRecipesContext)!;
  const {userData, setUserData} = useContext(UserDataContext)!;
  const { basketRecipes, setBasketRecipes } = useContext(BasketContext)!

  const buy = async () => {
    await buy_recipe(recipe.uuid)
    .then((ans)=>{
      if (ans.status === 200){
        setPurchasedRecipes([...purchasedRecipes, ans.data])
        setUserData({...userData, balance: userData.balance-ans.data.cost})
        setBasketRecipes(
          basketRecipes.filter((r) => r.uuid !== recipe.uuid)
        )
        setPurchasedChanges(purchasedChanges+1)
      }
    }).catch((ans)=>{
      if (ans.status === 400){
        toast("Не хватает средств")
      }
    })
  }

  return (
    <Button onClick={buy} variant={variant} size="lg" className="w-full rounded-[5px]">
      {children}
    </Button>
  )
}
