import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Newsletter from "@/components/Newsletter";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
