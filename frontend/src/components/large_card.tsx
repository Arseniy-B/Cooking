import { useState, useContext, useCallback } from "react"
import type { Recipe } from "@/services/api/schemas"

import { useSpring, animated } from "@react-spring/web"

import {
  Trash2,
  ShoppingCart,
  Eye,
  ChefHat,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BASE_URL,
  buy_recipe,
  remove_from_basket,
} from "@/services/api/handlers"

import {
  BasketContext,
  PurchasedChangesContext,
  PurchasedRecipesContext,
  type BasketContextType,
} from "@/services/contexts"

interface LargeCardProps {
  recipe: Recipe
}

export default function LargeCard({ recipe }: LargeCardProps) {
  const { purchasedRecipes, setPurchasedRecipes } =
    useContext(PurchasedRecipesContext)!

  const { purchasedChanges, setPurchasedChanges } =
    useContext(PurchasedChangesContext)!

  const { basketRecipes, setBasketRecipes } =
    useContext(BasketContext)!

  const basketCtx = useContext(BasketContext) as BasketContextType

  const [loaded, setLoaded] = useState(false)

  const imageAnim = useSpring({
    opacity: loaded ? 1 : 0,
    config: {
      tension: 120,
      friction: 20,
    },
  })

  const deleteBasketRecipe = useCallback(async () => {
    await remove_from_basket(recipe.uuid)

    basketCtx?.setBasketRecipes((prev) =>
      prev.filter((r) => r.uuid !== recipe.uuid)
    )
  }, [basketCtx, recipe.uuid])

  const handleBuy = async () => {
    await buy_recipe(recipe.uuid).then((ans) => {
      if (ans.data) {
        setPurchasedRecipes([...purchasedRecipes, recipe])

        setPurchasedChanges(purchasedChanges + 1)

        setBasketRecipes(
          basketRecipes.filter((r) => r.uuid !== recipe.uuid)
        )
      }
    })
  }

  return (
    <div
      className="
        w-full lg:w-[60vw]
        bg-white
        border
        rounded-[5px]
        p-2
        transition duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex flex-col lg:flex-row gap-3">

        {/* IMAGE */}
        <div className="lg:w-[320px] w-full h-[240px] rounded-[5px] overflow-hidden">
          {!loaded && (
            <Skeleton className="w-full h-full rounded-[5px]" />
          )}

          <animated.img
            src={BASE_URL + recipe.image_path}
            style={imageAnim}
            onLoad={() => setLoaded(true)}
            className={`
              ${loaded ? "w-full h-full" : ""}
              object-cover
              rounded-[5px]
              pointer-events-none
            `}
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between">

          {/* TOP */}
          <div className="flex flex-col gap-3">

            {/* TITLE */}
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold line-clamp-1">
                  {recipe.name}
                </h2>

                {recipe.country && (
                  <p className="text-sm text-muted-foreground">
                    {recipe.country}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <p className="text-sm leading-none font-medium">
                  {recipe.views}
                </p>

                <Eye size={15} />
              </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-1">
              {recipe.tags?.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="rounded-[5px]"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* META */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 border rounded-[5px] px-2 py-1 text-sm">
                <ChefHat size={15} />
                <span>Сложность {recipe.difficulty}/5</span>
              </div>

              <div className="flex items-center gap-2 border rounded-[5px] px-2 py-1 text-sm">
                <span>
                  {recipe.recipe_steps?.length || 0} шагов
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-end justify-between pt-4 gap-3">

            {/* PRICE */}
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">
                Стоимость
              </p>

              <p className="text-lg font-semibold">
                {recipe.cost} ₽
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={deleteBasketRecipe}
                className="rounded-[5px]"
              >
                <Trash2 size={16} />
              </Button>

              <Button
                onClick={handleBuy}
                className="rounded-[5px]"
              >
                <ShoppingCart size={16} />
                Купить
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
