import type { Recipe } from "@/services/api/schemas";
import { buy_recipe } from "@/services/api/handlers";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PurchasedChangesContext, PurchasedRecipesContext } from "@/services/contexts";


interface BuyRecipeButton {
  recipe: Recipe
}

export default function BuyRecipeButton({recipe}: BuyRecipeButton) {
  const {purchasedChanges, setPurchasedChanges} = useContext(PurchasedChangesContext)!;
  const {purchasedRecipes, setPurchasedRecipes} = useContext(PurchasedRecipesContext)!;

  const buy = async () => {
    await buy_recipe(recipe.uuid)
    .then((ans)=>{
      if (ans.data.success === true){
        setPurchasedRecipes([...purchasedRecipes, recipe])
        setPurchasedChanges(purchasedChanges+1)
      }
    })
  }

  return (
    <Button onClick={buy}>Купить</Button>
  )
}
