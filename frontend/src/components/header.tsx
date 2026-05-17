import { useEffect, useState, useContext } from "react";
import {
  Home,
  Search,
  ShoppingCart,
  LogIn,
  Menu,
  Refrigerator
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  AuthContext,
  BasketChangesContext,
  PurchasedChangesContext
} from "@/services/contexts";

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  const [isSm, setIsSm] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const { basketChanges, setBasketChanges } =
    useContext(BasketChangesContext)!;

  const { purchasedChanges, setPurchasedChanges } =
    useContext(PurchasedChangesContext)!;

  const { isLogin } = useContext(AuthContext)!;

  useEffect(() => {
    if (location.pathname === "/basket")
      setBasketChanges(0);

    if (location.pathname === "/account")
      setPurchasedChanges(0);
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width:640px)");

    setIsSm(media.matches);

    const handler = (e: MediaQueryListEvent) =>
      setIsSm(e.matches);

    media.addEventListener("change", handler);

    return () =>
      media.removeEventListener("change", handler);
  }, []);

  const totalChanges =
    basketChanges + purchasedChanges;

  const items = [
    {
      path: "/basket",
      text: "Корзина",
      icon: ShoppingCart,
      badge: basketChanges,
    },

    isLogin
      ? {
          path: "/account",
          text: "Аккаунт",
          icon: Refrigerator,
          badge: purchasedChanges,
        }
      : {
          path: "/auth",
          text: "Вход",
          icon: LogIn,
        },

    {
      path: "/search",
      text: "Поиск",
      icon: Search,
    },

    {
      path: "/",
      text: "Главная",
      icon: Home,
    },
  ];

  const renderButton = (
    item: (typeof items)[number],
    mobile = false
  ) => {
    const Icon = item.icon;

    return (
      <Button
        key={item.path}
        onClick={() => navigate(item.path)}
        variant={
          location.pathname === item.path
            ? "default"
            : "ghost"
        }
        className={
          mobile
            ? "relative h-10 flex justify-start items-center rounded-[10px]"
            : "relative w-10 h-10 flex justify-center items-center rounded-[10px]"
        }
      >
        <Icon className="h-5 w-5" />

        {mobile && (
          <p className="ml-2">{item.text}</p>
        )}

        {!!item.badge && (
          <Badge
            className="rounded-[5px] absolute -top-1 -right-1 h-5 min-w-5 px-1"
          >
            {item.badge > 99
              ? "99+"
              : item.badge}
          </Badge>
        )}
      </Button>
    );
  };

  if (isSm) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 p-2">
        <div className="grid grid-cols-[60%_40%] backdrop-blur-[130px] p-1 rounded-[10px]">
          <div className="flex justify-center items-center gap-10">
            {children}
          </div>

          <div className="flex justify-center gap-10">
            {items.map(item =>
              renderButton(item)
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-1">
      <Sheet>
        <SheetTrigger className="relative w-full p-2 backdrop-blur-[5px] rounded-[5px]">
          <div className="flex justify-between items-center">
            <p>
              {
                items.find(
                  i =>
                    i.path ===
                    location.pathname
                )?.text
              }
            </p>

            <div className="relative">
              <Menu />

              {!!totalChanges && (
                <Badge className="rounded-[5px] absolute -top-2 -right-2 h-5 min-w-5 px-1">
                  {totalChanges > 99
                    ? "99+"
                    : totalChanges}
                </Badge>
              )}
            </div>
          </div>
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-4 pt-[30%]">
          {items.map(item =>
            renderButton(item, true)
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
