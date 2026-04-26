import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { BasketContext, BasketChangesContext } from "@/services/contexts"
import { useNavigate } from "react-router-dom"
import { add_to_basket } from "@/services/api/handlers"
import { ShoppingCart } from "lucide-react"
import type { Recipe } from "@/services/api/schemas" 


export default function BasketButton({recipe}: {recipe: Recipe}){
  const navigate = useNavigate()
  const { basketRecipes, setBasketRecipes } = useContext(BasketContext)!;
  const { basketChanges, setBasketChanges } = useContext(BasketChangesContext)!;
  const add_recipe_to_basket = async (uuid: string) => {
    await add_to_basket(uuid).then(() => {
      setBasketRecipes([...basketRecipes, recipe])
      setBasketChanges(basketChanges+1)
    })
  }

  const recipeExists = basketRecipes.some(r => r.uuid === recipe.uuid);
  return (
    <>
      {recipeExists ? (
        <Button 
          onClick={()=>{navigate("/basket")}} 
          variant="ghost" 
          className="rounded-[5px]"
        >
          <ShoppingCart/>
        </Button>
      ) : (
        <Button 
          onClick={()=>{add_recipe_to_basket(recipe.uuid)}} 
          variant="default" 
          className="rounded-[5px]"
        >
          <ShoppingCart/>
        </Button>
      )}
    </>
  )
}
