import HeroSection from '@/components/home/HeroSection';
import PhilosophySection from '@/components/home/PhilosophySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PlantQuizGuide from '@/components/home/PlantQuizGuide';
import PlantCareTips from '@/components/home/PlantCareTips';
import CategorySection from '@/components/home/CategorySection';
import ArticlesPreview from '@/components/home/ArticlesPreview';
import LifestyleGallery from '@/components/home/LifestyleGallery';
import Testimonials from '@/components/home/Testimonials';
import ServiceFeatures from '@/components/home/ServiceFeatures';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <FeaturedProducts />
      <PlantQuizGuide />
      <PlantCareTips />
      <CategorySection />
      <ArticlesPreview />
      <LifestyleGallery />
      <Testimonials />
      <ServiceFeatures />
      <CTASection />
    </>
  );
}
