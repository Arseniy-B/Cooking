import { useState } from "react"
import type {Recipe} from "@/services/api/schemas" 
import { useSpring, animated } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { BASE_URL, remove_from_basket } from "@/services/api/handlers"
import { Delete } from "lucide-react"
import { useContext } from "react"
import { BasketContext } from "@/services/contexts"


interface LargeCardProps{
  recipe: Recipe
}

export default function LargeCard(props: LargeCardProps){
  const [loaded, setLoaded] = useState(false)
  const {basketRecipes, setBasketRecipes} = useContext(BasketContext)!;

  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 }
  })

  const deleteBasketRecipe = async () => {
    await remove_from_basket(props.recipe.uuid)
    .then(() => {
      setBasketRecipes([...basketRecipes.filter(r=>r.uuid !== props.recipe.uuid)])
    })
  }

  return (
    <div className="w-full p-5 mb-5 lg:p-0 lg:w-[60vw] h-[40vh]">
      <div className="h-px bg-red-800 w-full"></div>
      <div className="py-10 w-full h-full flex">
        <div className="h-full w-[60%] flex border rounded-[5px]">
          <animated.img 
            src={BASE_URL + props.recipe.image_path} 
            className={`${loaded? "h-full" : ""} p-2 object-cover lg:object-right pointer-none rounded-[10px] w-[50%]`}
            onLoad={(e) => {
              e.currentTarget.decode?.().then(() => {
                setLoaded(true)
              })
            }}
            style={imageLoaded}
          />
          <div className="flex flex-col justify-between w-full">
            <div className="w-full h-full p-2">
              {props.recipe.name}
            </div>
            <div className="flex justify-end w-full">
              <Button variant="ghost" onClick={deleteBasketRecipe}><Delete/></Button>
            </div>
          </div>
        </div>
        <div className="w-[50%]"></div>
      </div>
    </div>
  )
}
