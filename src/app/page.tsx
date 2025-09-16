import Banner from "../components/Banner";
import MarineEquipmentPage from "../components/MarineEquipmentPage";
import ProductsSection from "../components/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import MarineSupplyPage from "../components/MarineSupplyPage";
import FAQ from "../components/Faq";
import Flipbook from "../components/Flipbook";
import QHSEPolicySection from "../components/QHSEPolicySection";
import ProductCategoriesSection from "../components/ProductCategoriesSection";
import Testimony from "../components/Testimony";
export default function Home() {
  return (
    <div>
      <Banner />
      <MarineEquipmentPage />
      <ProductsSection />
      <WhyChooseUs />
      <MarineSupplyPage />
      <Flipbook />
      <FAQ />
      <QHSEPolicySection />
      <Testimony/>
      <ProductCategoriesSection />
    </div>
  );
}