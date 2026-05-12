import type { Recipe } from "@/services/api/schemas"
import { BASE_URL } from "@/services/api/handlers"

import { useState } from "react"
import { useSpring, animated } from "@react-spring/web"

import {
  Eye,
  ChefHat,
  Clock3,
  Play,
  CheckCircle2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"


function RecipeSteps({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-40">
      {recipe.recipe_steps.map((step, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-[5px] border bg-muted/40 p-2"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs text-white">
            {index + 1}
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-medium">
              step.title || `Шаг ${index + 1}`
            </p>

            {step.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function PurchasedRecipeCard({ recipe }: { recipe: Recipe }) {
  const [loaded, setLoaded] = useState(false)
  const [showSteps, setShowSteps] = useState(false)

  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 },
  })

  return (
    <div
      className="
        w-80 h-120
        bg-white
        rounded-[5px]
        border
        overflow-hidden
        transition duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-sm
        shadow-[inset_0_3px_6px_rgba(0,0,0,0.22)]
      "
    >
      <div className="relative h-[52%] w-full p-1">
        {!loaded && (
          <Skeleton className="h-full w-full rounded-[5px]" />
        )}

        {recipe.image_path && (
          <animated.img
            src={BASE_URL + recipe.image_path}
            style={imageLoaded}
            onLoad={() => setLoaded(true)}
            className={`
              ${loaded ? "w-full h-full" : ""}
              rounded-[5px]
              object-cover
              pointer-events-none
            `}
          />
        )}

        <div className="absolute left-3 top-3">
          <Badge className="rounded-[5px] gap-1">
            <CheckCircle2 size={12} />
            Куплено
          </Badge>
        </div>
      </div>

      <div className="flex h-[48%] flex-col justify-between p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-base font-semibold">
                {recipe.name}
              </h3>

              {recipe.country && (
                <p className="text-xs text-muted-foreground">
                  {recipe.country}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm">
              <p className="leading-none font-medium">
                {recipe.views}
              </p>
              <Eye size={15} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {recipe.tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-[5px]"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-[5px] border px-2 py-1 text-sm">
              <ChefHat size={15} />
              <span>Сложность {recipe.difficulty}/5</span>
            </div>

            <div className="flex items-center gap-2 rounded-[5px] border px-2 py-1 text-sm">
              <Clock3 size={15} />
              <span>{recipe.recipe_steps?.length} шагов</span>
            </div>
          </div>

          {showSteps && (
            <RecipeSteps recipe={recipe} />
          )}
        </div>

        <div className="flex gap-2 pt-3">
          <Button
            variant="secondary"
            className="flex-1 rounded-[5px]"
          >
            Читать рецепт
          </Button>

          <Button
            variant="outline"
            className="rounded-[5px]"
            onClick={() => setShowSteps((prev) => !prev)}
          >
            <Play size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PurchasedRecipeCard
