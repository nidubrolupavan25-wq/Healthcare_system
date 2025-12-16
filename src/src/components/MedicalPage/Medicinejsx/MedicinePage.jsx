import Brands from "./Brands";
import Conditions from "./Conditions";
import Deals50 from "./Deals50";
import MedicineHero from "./MedicineHero";
import MedicineList from "./MedicineList";
import medicines from "./medicines";
import QuickOptions from "./QuickOptions";
import ValueDeals from "./ValueDeals";
import valueProducts from "./valueProducts";


export default function MedicinePage({ addToCart }) {
  return (
    <main>
      <MedicineHero />
      <QuickOptions />
      <Conditions />
      <Brands />
     
     
      <MedicineList medicines={medicines} addToCart={addToCart} />
    </main>
  );
}
