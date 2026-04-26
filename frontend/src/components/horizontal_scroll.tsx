import type { Recipe } from "@/services/api/schemas"
import { useState } from "react"
import { useSpring, animated } from "@react-spring/web"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { BASE_URL } from "@/services/api/handlers"


function VerticalCard({recipe}: {recipe: Recipe}) {
  const [loaded, setLoaded] = useState(false)
  const imageLoaded = useSpring({
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 }
  })
  return (
    <div className="rounded-[5px] relative h-full">
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
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
      <div className="z-100 absolute bottom-1 text-white">
        <div className="h-[30%] p-5">
          {recipe.name} 
          <div className="flex flex-wrap">
          {recipe.tags && recipe.tags.map((value, i)=> (
            <Badge key={i} variant="ghost">{value.name}</Badge>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HorizontalScroll({recipes}: {recipes: Recipe[]}) {
  return (
    <section className="w-full py-10 flex justify-center overflow-hidden">
      <Carousel
        opts={{ align: "start" }}
        className="w-[80%]"
      >
        <CarouselContent className="-ml-4 h-130">
          {recipes.map((value, i) => (
            <CarouselItem
              key={i}
              className="
                pl-5
                basis-1/1
                sm:basis-1/1
                md:basis-1/2
                lg:basis-1/4
              "
            >
              <VerticalCard recipe={value} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="" />
        <CarouselNext className="" />
      </Carousel>
    </section>
  )
}
