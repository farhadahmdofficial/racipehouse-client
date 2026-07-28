import Banner from "@/components/Banner";
import FeaturedRecipes from "@/components/FeaturedRecipes";
import PopularRecipes from "@/components/PopularRecipes";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <Banner></Banner>
   <FeaturedRecipes></FeaturedRecipes>
   <PopularRecipes></PopularRecipes>
   
   </>
  );
}
