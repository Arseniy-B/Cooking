import { useRef } from "react";
import VerticalCard from "../components/vertical_card"


export default function HorizontalScroll() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10">◀</button>
      <div ref={sliderRef} className="flex overflow-x-auto gap-20 p-4 snap-x snap-mandatory scrollbar-hide">
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
        <VerticalCard/>
      </div>
      <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10">▶</button>
    </div>
  );
}
