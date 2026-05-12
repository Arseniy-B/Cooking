import { useState, useEffect } from "react"
import SearchInput from "@/components/search"
import SimpleCard from "@/components/simple_card"
import HorizontalScroll from "@/components/horizontal_scroll"
import CurrentOffers from "@/components/current_offers"
import MainImage from "@/assets/main.webp"
import SecondImage from "@/assets/secondary.png"
import { useSpring, animated, useInView, useScroll } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import type { Recipe, RecipeSearch } from "@/services/api/schemas"
import { get_suitable_recipe } from "@/services/api/handlers"
import Header from "@/components/header.tsx"
import { useNavigate } from "react-router-dom"


export default function Home(){
  const navigate = useNavigate();
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>(Array.from({ length: 8 }, (_, i) => ({
    uuid: "",
    name: `Recipe ${i + 1}`,
    country: null,
    difficulty: 0,
    tags: [],
    views: 0,
    recipe_steps: [],
    image_path: "",
    cost: 0,
  })));
  const [freeRecipes, setFreeRecipes] = useState<Recipe[]>(Array.from({ length: 8 }, (_, i) => ({
    uuid: "",
    name: `Recipe ${i + 1}`,
    country: null,
    difficulty: 0,
    tags: [],
    views: 0,
    recipe_steps: [],
    image_path: "",
    cost: 0,
  })))
  const [loaded, setLoaded] = useState(false)
  const [loadedSecond, setLoadedSecond] = useState(false)
  const { scrollYProgress } = useScroll()
  const [ref, inView] = useInView()
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -50% 0px' }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);
  
  async function init_recipes(){
    const popular_search: RecipeSearch = {name: "", popular: true, size: 6}
    await get_suitable_recipe(popular_search)
    .then((ans) => {
      setPopularRecipes(ans.data);
    })
    const free_search: RecipeSearch = {name: "", cost: false}
    await get_suitable_recipe(free_search)
    .then((ans) => {
      setFreeRecipes(ans.data);
    })
  }
  useEffect(() => {
    init_recipes()
  }, [])

  const appearanceLeft = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    config: { tension: 100, mass: 2},
  })

  const appearanceRight = useSpring({
    from: { opacity: 0},
    to: { opacity: inView ? 1 : 0},
    delay: inView ? 200 : 0,
    config: { tension: 500, friction: 100, mass: 1, },
  })
  const imageLoaded = useSpring({
    transform: loaded ? scrollYProgress.to(p => `rotate(${p * 90}deg) translateX(${-p * 900}px)`) : "translateX(0px)",
    opacity: loaded ? 1 : 0,
    config: { tension: 120, friction: 20 },
    delay: 100
  })

  const imageAnim = useSpring({
    opacity: loadedSecond ? 1 : 0,
    transform: loadedSecond ? "scale(1)" : "scale(1.05)",
    config: { tension: 120, friction: 20 }
  });

  const textAnim = useSpring({
    opacity: loadedSecond ? 1 : 0,
    transform: loadedSecond ? "translateX(0px)" : "translateX(40px)",
    delay: 200
  });


  return (
    <>
      <Header>
        {["home", "popular", "free"].map(section => (
          <a
            key={section}
            href={`#${section}`}
            className={activeSection === section ? '' : ''}
          >
            {section === 'home' ? 'Главная' : 
             section === 'popular' ? 'Популярные' : 'Бесплатные'}
            {activeSection === section && (
              <div className="h-px w-full bg-red-800"></div>
            )}
          </a>
        ))}
      </Header>
      <section id="home" className="w-full h-screen grid lg:grid-cols-[60%_40%] grid-cols-1 lg:grid-rows-1 grid-rows-[75vh_25vh] bg-white">
        <div className="p-[10vw]">
          <animated.div style={appearanceLeft}>
            <div className="lg:w-[40vw] flex flex-col pt-[20vw] lg:pt-[5vw] gap-15">
              <p className="leading-[1.2] text-[2rem] md:text-[3rem] lg:text-[5rem]
                text-2xl font-bold
                transition-all duration-300
              ">Вы знаете что приготовить?</p>
              <p className="lg:text-[1.2rem] text-gray-500">На этом сайте вы сможете найти рецепты на любой вкус и бюджет. Сохраните свое время и ешьте то, что вам нравиться</p>
              <SearchInput />
            </div>
          </animated.div>
        </div>
        <div className="relative bg-red-800 overflow-hidden">
          <animated.img 
            src={MainImage} 
            className="absolute inset-0 w-full left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square"
            onLoad={(e) => 
              e.currentTarget.decode?.().then(() => {
              setLoaded(true)
            })}
            style={imageLoaded}
          />
          <div className="absolute h-full w-full flex items-center justify-center">
            <div className="w-[70vw] lg:w-90 lg:px-2 lg:py-10 rounded-[10px] backdrop-blur-[1px] ">
              <animated.div ref={ref} style={appearanceRight}>
                <CurrentOffers/>
              </animated.div>
            </div>
          </div>
        </div>
      </section>
      <section id="popular" className="z-20 bg-gray-100 min-h-screen pb-[10vw] pt-[10vw]">
        <div className="grid place-items-center">
          <p className="intile-block text-[1.5rem] lg:text-[2.5rem]">Популярные результаты</p>
          <div className="bg-red-800 w-37.5 lg:w-[20vw] h-px"></div>
        </div>
        <div className="flex justify-center mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
            {popularRecipes && popularRecipes.map((value, i) => (
              <SimpleCard key={i} recipe={value}/>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-20">
          <Button onClick={()=>{
            navigate("/search?cost=true")
          }} className="bg-orange-400 p-5 rounded-[5px]">Узнать больше</Button>
        </div>
      </section>

      <section className="min-h-[80vh] w-full bg-red-800 flex flex-col lg:flex-row justify-center">
        <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-auto overflow-hidden">
          <animated.img
            src={SecondImage}
            alt="DimSum"
            className="w-full h-full object-cover"
            style={imageAnim}
            onLoad={(e) =>
              e.currentTarget.decode?.().then(() => setLoadedSecond(true))
            }
          />
        </div>
        <animated.div
          style={textAnim}
          className="w-full lg:w-1/3 text-white flex flex-col justify-center px-8 lg:px-16 py-10 gap-4"
        >
          <h2 className="text-3xl lg:text-5xl font-semibold">
            Димсамы
          </h2>

          <div className="bg-white w-20 lg:w-32 h-0.5" />

          <p className="text-sm lg:text-lg opacity-90 max-w-md">
            Маленькие, сочные и насыщенные вкусом. Дальние родственники вареников и хинкали,
            пришедшие из китайской кухни.
          </p>

          <button className="mt-4 bg-orange-400 hover:bg-orange-500 transition w-36 lg:w-48 rounded-md py-3 text-black font-medium">
            В корзину
          </button>
        </animated.div>
      </section>
      <section id="free" className="min-h-screen w-full py-[15vh]">
        <div className="grid place-items-center">
          <p className="intile-block text-[1.5rem] lg:text-[2.5rem]">Бесплатные рецепты</p>
          <div className="bg-red-800 w-37.5 lg:w-[17vw] h-px"></div>
        </div>
        <HorizontalScroll recipes={freeRecipes}/>
      </section>
    </>
  )
}
