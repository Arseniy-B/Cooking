import type { Recipe } from "@/services/api/schemas"
import { useNavigate } from "react-router-dom"
import { add_to_basket } from "@/services/api/handlers"
import { useState } from "react"
import { useSpring, animated } from "@react-spring/web"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BASE_URL } from "@/services/api/handlers"
import { ShoppingCart, Eye } from "lucide-react"
import { useContext } from "react"
import { BasketContext, BasketChangesContext } from "@/services/contexts"


interface RecipeProps {
  recipe: Recipe
}

const SimpleCard: React.FC<RecipeProps> = ({recipe}) => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const { basketRecipes, setBasketRecipes } = useContext(BasketContext)!;
  const { basketChanges, setBasketChanges } = useContext(BasketChangesContext)!;
  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 }
  })

  const add_recipe_to_basket = async (uuid: string) => {
    await add_to_basket(uuid).then(() => {
      setBasketRecipes([...basketRecipes, recipe])
      setBasketChanges(basketChanges+1)
    })
  }

  const recipeExists = basketRecipes.some(r => r.uuid === recipe.uuid);

  return (
    <div className="w-80 h-120 lg:w-80 lg:h-120 bg-white rounded-[5px] border
      transition duration-300 ease-out 
      hover:-translate-y-1 hover:scale-100
      hover:shadow-lg active:scale-100">
      <div className="rounded-[5px] w-full h-[60%] p-1">
        {!loaded && (
          <Skeleton className="h-full w-full rounded-[5px]">
          </Skeleton>
        )}
        {recipe.image_path && (
          <animated.img 
            src={BASE_URL + recipe.image_path} 
            className={`${loaded? "w-full h-full" : ""} object-cover lg:object-right pointer-none rounded-[5px]`}
            onLoad={(e) => {
              e.currentTarget.decode?.().then(() => {
                setLoaded(true)
              })
            }}
            style={imageLoaded}
          />
        )}
      </div> 
      <div className="p-2 h-[40%] flex flex-col justify-between">
        <div className="flex justify-between">
          <p>{recipe.name}</p>
          <div className="flex justify-center items-center gap-1">
            <p className="text-sm leading-none font-medium">{recipe.views}</p>
            <Eye size={15}/>
          </div>
        </div>
        <div>
         {recipe.tags && recipe.tags.map((value, i) => (
           <Badge key={i} variant="outline" className="rounded-[5px]">{value.name}</Badge>
         ))}
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" size="lg" className="w-[50%] rounded-[5px]">Купить</Button>
          <div className="flex justify-center items-center"><p className="text-sm leading-none font-medium">{recipe.cost} руб</p></div>
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
        </div>
      </div>
    </div>
  )
}

export default SimpleCard
