import type { Recipe } from "@/services/api/schemas"
import { BASE_URL } from "@/services/api/handlers"

import { useState } from "react"
import { useSpring, animated } from "@react-spring/web"

import {
  Eye,
  ChefHat,
  Clock3,
  CheckCircle2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function RecipeDialog({ recipe }: { recipe: Recipe }) {
  return (
    <Dialog>
      <DialogTrigger render=
        <Button
          variant="secondary"
          className="flex-1 rounded-[5px]"
        ></Button>
      >
          Читать рецепт
      </DialogTrigger>

      <DialogContent className="rounded-[10px]">
        <DialogHeader>
          <DialogTitle className="w-full">
            {recipe.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 w-78 lg:w-88">
          {recipe.image_path && (
            <img
              src={BASE_URL + recipe.image_path}
              className="
                h-60
                w-full
                rounded-[8px]
                object-cover
              "
            />
          )}

          <Carousel className="w-[70%] m-auto">
            <CarouselContent>
              {recipe.recipe_steps.map((step, index) => (
                <CarouselItem key={index}>
                  <div
                    className="
                      min-h-60
                      rounded-[8px]
                      border
                      p-6
                      flex
                      flex-col
                      gap-4
                    "
                  >
                    <Badge className="w-fit">
                      Шаг {index + 1}
                    </Badge>

                    <h3 className="text-lg font-semibold">
                      {step.title || `Шаг ${index + 1}`}
                    </h3>

                    <p className="text-muted-foreground">
                      {step.description ||
                        "Описание отсутствует"}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PurchasedRecipeCard({
  recipe,
}: {
  recipe: Recipe
}) {
  const [loaded, setLoaded] = useState(false)

  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: {
      tension: 120,
      friction: 20,
    },
  })

  return (
    <div
      className="
      w-80 h-120
      bg-white
      rounded-[5px]
      border
      overflow-hidden
      transition
      hover:-translate-y-1
      hover:shadow-sm
      shadow-[inset_0_3px_6px_rgba(0,0,0,0.22)]
    "
    >
      <div className="relative h-[52%] p-1">
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
              object-cover
              rounded-[5px]
              pointer-events-none
            `}
          />
        )}

        <div className="absolute top-3 left-3">
          <Badge className="gap-1 rounded-[5px]">
            <CheckCircle2 size={12} />
            Куплено
          </Badge>
        </div>
      </div>

      <div className="flex h-[48%] flex-col justify-between p-3">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div>
              <h3 className="line-clamp-1 font-semibold">
                {recipe.name}
              </h3>

              {recipe.country && (
                <p className="text-xs text-muted-foreground">
                  {recipe.country}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <p>{recipe.views}</p>
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
              Сложность {recipe.difficulty}/5
            </div>

            <div className="flex items-center gap-2 rounded-[5px] border px-2 py-1 text-sm">
              <Clock3 size={15} />
              {recipe.recipe_steps?.length} шагов
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <RecipeDialog recipe={recipe} />
        </div>
      </div>
    </div>
  )
}

export default PurchasedRecipeCard
