import { useEffect, useState } from "react"
import Header from "@/components/header"
import { get_suitable_recipe } from "@/services/api/handlers"
import SimpleCard from "@/components/simple_card"
import type { Recipe, RecipeSearch } from "@/services/api/schemas"
import { useScroll, animated } from '@react-spring/web';
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { useSearchParams} from "react-router-dom";
import { SearchIcon } from "lucide-react"
import TagsSelect from "@/components/tags_select"
import SearchFilters from "@/components/search_filters"


export default function Search(){
  const [recipes, setRecipes] = useState<Recipe[]>(Array.from({ length: 8 }, () => ({
    uuid: "",
    name: "",
    country: null,
    difficulty: 0,
    tags: [],
    views: 0,
    recipe_steps: [],
    image_path: "",
    cost: 0,
  })));
  const [ searchParams ] = useSearchParams()
  const [search, setSearch] = useState<RecipeSearch>({})
  const [tags, setTags] = useState<string[]>([])
  const { scrollY } = useScroll();
  const [isLg, setIsLg] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")

    const update = () => setIsLg(mq.matches)
    update()

    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const y = scrollY.to(scroll => scroll);

  const getRecipes = async () => {
    await get_suitable_recipe(search, tags)
    .then((ans) => {
      setRecipes(ans.data)
    })
  }

  useEffect(()=>{
    const allParams = Object.fromEntries(searchParams)
    if (allParams){
      setSearch(allParams)
    }
    setSearch({cost: true})
  }, [searchParams])
  
  useEffect(()=>{
    getRecipes()
  }, [search, tags])

  const nameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({...search, name: e.target.value})
  }

  return (
    <>
      <Header></Header>
      <section className="min-h-screen w-full lg:grid lg:grid-cols-[34%_auto] overflow-hidden">
        <animated.div style={{ transform: isLg ? y.to(y => `translateY(${y}px)`) : ""}}>
          <div className="flex flex-col justify-center mt-30 items-center px-[20%]">
            <div className="flex w-full justify-center">
              <InputGroup className="rounded-[5px]">
                <InputGroupInput onChange={nameChange} id="input-group-url" placeholder="Введите название блюда" />
                <InputGroupAddon align="inline-end">
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <TagsSelect tags={tags} setTags={setTags}/>
          </div>
        </animated.div>
        <div className="my-20">
          <div className="flex justify-center lg:justify-normal mb-5">
            {Object.keys(search).length > 0 && (
              <SearchFilters search={search} setSearch={setSearch}/>    
            )}
          </div>
          <div className="flex flex-wrap justify-center lg:justify-normal gap-5">
            {recipes.map((value, i) => (
              <SimpleCard key={i} recipe={value}/>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
