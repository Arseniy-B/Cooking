import { useEffect, useState, useContext } from "react"
import { Home, Search, ShoppingCart, LogIn, User, Menu} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AuthContext, BasketChangesContext, PurchasedChangesContext } from "@/services/contexts"


type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const [isSm, setIsSm] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const {basketChanges, setBasketChanges} = useContext(BasketChangesContext)!;
  const {purchasedChanges, setPurchasedChanges} = useContext(PurchasedChangesContext)!;
  const {isLogin, } = useContext(AuthContext)!;

  useEffect(()=>{
    switch (location.pathname){
      case "/basket": 
        setBasketChanges(0)
        break;
      case "/account":
        setPurchasedChanges(0)
    }
  }, [location])
  
  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)")
    setIsSm(media.matches)
    media.addEventListener("change", e => setIsSm(e.matches))
  }, [])

  const locationMap = () => {
    switch (location.pathname){
      case "/": return "Главная";
      case "/basket": return "Корзина";
      case "/search": return "Поиск";
      case "/account": return "Аккаунт";
      case "/auth": return "Вход";
    }
  };
    
  if (isSm){
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-2">
      <div className="grid grid-cols-[60%_40%] backdrop-blur-[130px] p-1 rounded-[10px]">
        <div className="flex justify-center gap-10 items-center">
          {children}
        </div>
        <div className="flex justify-center gap-10">
          <Button onClick={() => {
            navigate("/basket")
          }} variant={location.pathname === "/basket" ? "default" : "ghost"} className="relative w-10 h-10 flex justify-center items-center rounded-[10px]" >
            <ShoppingCart className="h-5 w-5"/>
            {basketChanges>0 && (
              <Badge
                variant="default"
                className="absolute -top-1.5 -left-1.5 h-5 w-5 text-white rounded-[5px]"
              >
                {basketChanges> 99 ? "99+" : basketChanges}
              </Badge>
            )}
          </Button>
          {isLogin === false && (
            <Button onClick={() => {
              navigate("/auth")
            }} variant={location.pathname === "/auth" ? "default" : "ghost"} className="w-10 h-10 flex justify-center items-center rounded-[10px]" >
              <LogIn />
            </Button>
          )}
          {isLogin === true && (
            <Button onClick={() => {
              navigate("/account")
            }} variant={location.pathname === "/account" ? "default" : "ghost"} className="w-10 h-10 flex justify-center items-center rounded-[10px]" >
              <User />
              {purchasedChanges>0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1.5 -left-1.5 h-5 w-5 text-white rounded-[5px]"
                >
                  {purchasedChanges> 99 ? "99+" : purchasedChanges}
                </Badge>
              )}
            </Button>
          )}
          <Button onClick={() => {
            navigate("/search")
          }} variant={location.pathname === "/search" ? "default" : "ghost"} className="w-10 h-10 flex justify-center items-center rounded-[10px]" >
            <Search />
          </Button>
          <Button onClick={() => {
            navigate("/")
          }} variant={location.pathname === "/" ? "default" : "ghost"} className="w-10 h-10 flex justify-center items-center rounded-[10px]" >
            <Home />
          </Button>
        </div>
      </div>
    </header>
  )
  }
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-1">
        <Sheet>
          <SheetTrigger className="backdrop-blur-[5px] w-full p-2 rounded-[5px]">
            <div className="opacity-80 w-full flex justify-between rounded-[5px] p-1 pl-2">
              <p>{locationMap()}</p>
              <Menu/>
            </div>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-10 pt-[30%]">
            <Button onClick={() => {
              navigate("/basket")
            }} variant={location.pathname === "/basket" ? "default" : "ghost"} className="w-full h-10 flex justify-start items-center rounded-[10px]" >
              <ShoppingCart />
              <p>Карзина</p>
            </Button>
            {isLogin === false && (
              <Button onClick={() => {
                navigate("/auth")
              }} variant={location.pathname === "/auth" ? "default" : "ghost"} className="w-full h-10 flex justify-start items-center rounded-[10px]" >
                <LogIn />
                <p>Вход</p>
              </Button>
            )}
            {isLogin === true && (
              <Button onClick={() => {
                navigate("/account")
              }} variant={location.pathname === "/account" ? "default" : "ghost"} className="w-full h-10 flex justify-start items-center rounded-[10px]" >
                <User />
                <p>Аккаунт</p>
              </Button>
            )}
            <Button onClick={() => {
              navigate("/search")
            }} variant={location.pathname === "/search" ? "default" : "ghost"} className="w-full h-10 flex justify-start items-center rounded-[10px]" >
              <Search />
              <p>Поиск</p>
            </Button>
            <Button onClick={() => {
              navigate("/")
            }} variant={location.pathname === "/" ? "default" : "ghost"} className="w-full h-10 flex justify-start items-center rounded-[10px]" >
              <Home />
              <p>Главная</p>
            </Button>
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
