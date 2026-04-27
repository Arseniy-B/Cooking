import Header from "@/components/header"
import CurrentOffers from "@/components/current_offers"
import MainImage from "@/assets/main.webp"
import { useState } from "react"
import { useSpring, animated, useScroll } from "@react-spring/web"
import { useContext } from "react"
import { BasketContext } from "@/services/contexts"
import LargeCard from "@/components/large_card"
import {Button} from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"


const DottedRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-2 w-full">
    <span className="text-sm font-medium whitespace-nowrap">{label}</span>

    <div className="flex-1 h-[2px]
      bg-[radial-gradient(circle,_#1f2937_1.5px,_transparent_1.5px)]
      bg-[length:6px_2px] translate-y-[-2px]" 
    />

    <span className="text-sm font-semibold whitespace-nowrap">{value}</span>
  </div>
)


export default function Basket(){
  const navigate = useNavigate()
  const {basketRecipes } = useContext(BasketContext)!;
  const [loaded, setLoaded] = useState(false)
  const { scrollYProgress } = useScroll()

  const imageLoaded = useSpring({
    transform: loaded ? scrollYProgress.to(p => `rotate(${p * 50}deg) translateX(${-p * 500}px)`) : "translateX(-100px)",
    config: { tension: 120, friction: 20 },
  })

  return (
    <>
      <Header></Header>
      <section className="w-full min-h-screen pt-15 lg:pt-0 grid grid-rows-[60vh_20vh_20vh] lg:grid-rows-1 grid-cols-1 lg:grid-cols-[400px_25vw_auto]">
        <div className="order-3 lg:order-1 bg-red-800 flex justify-center items-center p-10">
          <CurrentOffers/>
        </div>
        <div className="order-2 lg:order-2 overflow-hidden relative">
          <animated.img 
            src={MainImage} 
            className="absolute inset-0 w-full left-1/2 lg:left-0 lg:top-1/2 -translate-x-1/2 -translate-y-10 lg:-translate-x-1/2 lg:-translate-y-1/2 aspect-square rotate-180 lg:rotate-0"
            onLoad={(e) => 
              e.currentTarget.decode?.().then(() => {
              setLoaded(true)
            })}
            style={imageLoaded}
          />
        </div>
        <div className="order-1 lg:order-3 flex justify-center lg:justify-normal items-center">
          <div className="w-[80%] lg:w-[50%]">
            <div className="w-full space-y-2">
              <DottedRow label="Баланс" value="450 ₽" />
              <DottedRow label="Заказов на" value="450 ₽" />
            </div>
            <Separator className="my-5" />
            <div className="text-sm text-center space-y-1">
              <DottedRow label="Позиций" value="29 шт"/>
              <DottedRow label="Каллорийность" value="2100 ккал"/>
            </div>
            <Separator className="my-5"/>
            <div className="text-sm text-center space-y-1">
              <p className="font-medium">Среднее по всем рецептам</p>
              <DottedRow label="Белки" value="28 г"/>
              <DottedRow label="Жиры" value="28 г"/>
              <DottedRow label="Углеводы" value="28 г"/>
            </div>
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
    </>
  )
}
