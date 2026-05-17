import type { Recipe } from "@/services/api/schemas"
import BasketButton from "@/components/basket_button"
import { useContext, useState } from "react"
import { useSpring, animated } from "@react-spring/web"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { BASE_URL } from "@/services/api/handlers"
import { Eye } from "lucide-react"
import { PurchasedRecipesContext } from "@/services/contexts"
import PurchasedRecipeCard from "./purchased_card"
import BuyRecipeButton from "@/components/pay_button"


interface RecipeProps {
  recipe: Recipe
}

const SimpleCard: React.FC<RecipeProps> = ({recipe}) => {
  const {purchasedRecipes} = useContext(PurchasedRecipesContext)!;

  const purchasedExist = purchasedRecipes.find(r=>r.uuid === recipe.uuid);
  if (purchasedExist){
    return(
      <PurchasedRecipeCard recipe={purchasedExist}/>
    )
  }
  const [loaded, setLoaded] = useState(false)
  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 }
  })
  return (
    <div className="w-80 h-120 lg:h-120 bg-white rounded-[5px] border
      transition duration-300 ease-out 
      hover:-translate-y-1 hover:scale-100
      hover:shadow-lg active:scale-100
      shadow-[0_2px_6px_rgba(0,0,0,0.22)]"
    >
      <div className="rounded-[5px] w-full h-[60%] p-1">
        {!loaded && (
          <Skeleton className="h-full w-full rounded-[5px]">
          </Skeleton>
        )}
        {recipe.image_path && (
          <animated.img 
            src={BASE_URL + recipe.image_path} 
            className={`${loaded? "w-full h-full" : ""} object-cover lg:object-right pointer-none rounded-[5px]`}
            onLoad={() => {
              setLoaded(true)
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
          <div className="w-[50%]">
            <BuyRecipeButton recipe={recipe} variant="secondary">
              Купить
            </BuyRecipeButton>
          </div>
          <div className="flex justify-center items-center"><p className="text-sm leading-none font-medium">{recipe.cost} руб</p></div>
          <BasketButton recipe={recipe}/>
        </div>
      </div>
    </div>
  )
}

export default SimpleCard
