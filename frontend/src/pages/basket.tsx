import Header from "@/components/header"
import CurrentOffers from "@/components/current_offers"
import MainImage from "@/assets/main.webp"
import { useState } from "react"
import { useSpring, animated, useScroll } from "@react-spring/web"
import { useContext } from "react"
import { BasketContext } from "@/services/contexts"
import LargeCard from "@/components/large_card"
import {Button} from "@/components/ui/button"
import { useNavigate } from "react-router-dom"


export default function Basket(){
  const navigate = useNavigate()
  const {basketRecipes } = useContext(BasketContext)!;
  const [loaded, setLoaded] = useState(false)
  const { scrollYProgress } = useScroll()

  const imageLoaded = useSpring({
    transform: loaded ? scrollYProgress.to(p => `rotate(${p * 100}deg) translateX(${-p * 900}px)`) : "translateX(-900px)",
    config: { tension: 120, friction: 20 },
    delay: 100
  })

  return (
    <>
      <Header></Header>
      <section className="w-full h-screen pt-15 lg:pt-0 lg:grid lg:grid-cols-[400px_30vw_auto]">
        <div className="bg-red-800 flex justify-center items-center p-10">
          <CurrentOffers/>
        </div>
        <div className="overflow-hidden relative">
          <animated.img 
            src={MainImage} 
            className="absolute inset-0 w-full left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square"
            onLoad={(e) => 
              e.currentTarget.decode?.().then(() => {
              setLoaded(true)
            })}
            style={imageLoaded}
          />
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-gray-700 w-[30vw]">
            <span>Название товара или услуги</span>
            <div className="flex-1 border-b-2 border-dotted border-gray-400"></div>
            <span className="font-medium">2 490 ₽</span>
          </div>
        </div>
      </section>
      {basketRecipes.length>0 ? (
        <section className="w-full min-h-screen py-[10vh] bg-gray-100 flex flex-col items-center">
          {basketRecipes.map((value, i) => (
            <LargeCard recipe={value} key={i} />
          ))}
        </section>
      ): (
      <section className="h-screen flex flex-col gap-1 bg-gray-100 justify-center items-center">
        <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Вы еще не выбрали рецепты для покупки
        </p>
        <Button onClick={() => {
          navigate("/search")
        }} className="rounded-[5px]">Поиск рецептов</Button>
      </section>
      )}
      <section className="h-screen">
        <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Мои рецепты
        </p>
      </section>
    </>
  )
}
