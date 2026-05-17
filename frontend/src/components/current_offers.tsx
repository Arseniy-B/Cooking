import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { get_suitable_recipe, BASE_URL } from "@/services/api/handlers"
import type { Recipe, RecipeSearch } from "@/services/api/schemas"
import { animated, useSprings } from "@react-spring/web"


export default function CurrentOffers() {
  const length = 5;
  const [isLg, setIsLg] = useState(false)
  const [slides, setSlides] = useState<Recipe[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(length).fill(false));

  const springs = useSprings(
    length,
    imagesLoaded.map((loaded, i) => ({
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'scale(1)' : 'scale(0.8)',
      delay: i * 50,
    })),
  );

  async function get_slides(){
    const search: RecipeSearch = {name: "", cost: true}
    const ans = await get_suitable_recipe(search)
    setSlides(ans.data)
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    setIsLg(media.matches)
    media.addEventListener("change", e => setIsLg(e.matches))
    get_slides()
  }, [])

  if (slides.length !== 0){
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        orientation={isLg ? "vertical" : "horizontal"}
        className="lg:w-90 w-[70vw] lg:h-full"
      >
        <CarouselContent className="lg:-mt-1 lg:h-[45vh] lg:overflow-visible">
          {slides && slides.map((value, index) => (
            <CarouselItem key={index} className="rounded-[5px] basis-1/1 lg:basis-1/3 pl-4">
              <div className={`${value.cost > 20 ? "bg-white text-black" : "bg-red-900 text-white"} 
                  h-25 lg:h-full w-full items-center justify-between rounded-[5px]
                  transition hover:shadow-lg flex lg:grid lg:grid-cols-[auto_50%] gap-5
                  ${isLg ? "hover:-translate-x-4" : "hover:-translate-y-2"}
              `}>
                <animated.img
                  key={index}
                  src={BASE_URL + value.image_path}
                  style={springs[index]}
                  className="h-25 lg:h-31 aspect-square object-cover rounded-[5px] shrink-0"
                  onLoad={(e) => {
                    e.currentTarget.decode?.().then(() => {
                      setImagesLoaded(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                    })
                  }}
                  alt=""
                />
                <div className="w-full h-full flex flex-col justify-center gap-5">
                  <p>{value.name}</p>
                  <p className={`${value.cost > 20? "text-green-500" : ""}`}>{value.cost}руб</p>
                  
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="rounded-[5px]" variant="default" size="icon-lg" />
        <CarouselNext className="rounded-[5px]" variant="default" size="icon-lg" />
      </Carousel>
    )
  }
  return (<></>)
}
