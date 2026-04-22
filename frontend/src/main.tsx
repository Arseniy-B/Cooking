import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom"

import Home from './pages/home.tsx'
import Basket from "./pages/basket.tsx"
import Footer from "./components/footer.tsx"
import Auth from "./pages/auth.tsx"
import Account from "./pages/account.tsx"
import Search from "./pages/search.tsx"
import { useState, useEffect } from "react";
import { AuthContext, BasketContext, BasketChangesContext } from "@/services/contexts.ts";
import { check_login, get_basket } from "@/services/api/handlers.ts"
import type {Recipe} from "@/services/api/schemas.ts"
import ScrollToTop from "@/components/scroll_to_top.tsx" 


export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/", 
    element: <RootLayout/>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/basket", element: <Basket /> },
      { path: "/auth", element: <Auth/>},
      { path: "/account", element: <Account/>},
      { path: "/search", element: <Search/>},
      { path: "*", element: 
      <div className="h-screen flex flex-col justify-center items-center">
        404 Not Found
        <Link to={{pathname: "/"}}><Button className="rounded-[5px]">На главную страницу</Button></Link>
      </div> },
    ]
  }
])


function App(){
  const [isLogin, setIsLogin] = useState(false)
  const [basketRecipes, setBasketRecipes] = useState<Recipe[]>([])
  const [basketChanges, setBasketChanges] = useState<number>(0)

  async function getBasketRecipes(){
    const ans = await get_basket()
    setBasketRecipes(ans.data)
  }

  async function checkIsLogin(){
    const ans = await check_login()
    setIsLogin(ans.data.success)
    if (ans.data.success){
      await getBasketRecipes()
    } else {
      setBasketRecipes([])
    }
  }
  useEffect(() => {
    checkIsLogin()
  }, [isLogin])

  return (
    <>
      <AuthContext value={{isLogin, setIsLogin}}>
        <BasketContext value={{basketRecipes, setBasketRecipes}}>
          <BasketChangesContext value={{basketChanges, setBasketChanges}}>
            <RouterProvider router={router} />
          </BasketChangesContext>
        </BasketContext>
      </AuthContext>
      <Footer/>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <>
    <App/>
  </>
)
