import { useState, useContext, useCallback } from "react"
import type { Recipe } from "@/services/api/schemas"
import { useSpring, animated } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import { BASE_URL, remove_from_basket } from "@/services/api/handlers"
import { Delete } from "lucide-react"
import { BasketContext, type BasketContextType } from "@/services/contexts"

interface LargeCardProps {
  recipe: Recipe
}

export default function LargeCard({ recipe }: LargeCardProps) {
  const [loaded, setLoaded] = useState(false)
  const basketCtx = useContext(BasketContext) as BasketContextType

  const imageAnim = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 }
  })

  const deleteBasketRecipe = useCallback(async () => {
    await remove_from_basket(recipe.uuid)

    basketCtx?.setBasketRecipes(prev =>
      prev.filter(r => r.uuid !== recipe.uuid)
    )
  }, [basketCtx, recipe.uuid])

  return (
    <div className="w-full lg:w-[60vw] p-5 lg:p-0 mb-5">
      
      <div className="h-px bg-red-800 w-full mb-6" />

      <div className="flex gap-6 h-[40vh]">

        {/* IMAGE */}
        <div className="w-1/2 border rounded-md overflow-hidden">
          <animated.img
            src={BASE_URL + recipe.image_path}
            className="w-full h-full object-cover pointer-events-none"
            style={imageAnim}
            onLoad={(e) => {
              e.currentTarget.decode?.().then(() => setLoaded(true))
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="w-1/2 flex flex-col justify-between">
          
          <div className="text-lg font-medium">
            {recipe.name}
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={deleteBasketRecipe}
              className="hover:text-red-500 transition"
            >
              <Delete />
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
