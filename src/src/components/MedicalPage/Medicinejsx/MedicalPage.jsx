import MedicineHero from "./MedicineHero";
import QuickOptions from "./QuickOptions";
import Conditions from "./Conditions";
import Brands from "./Brands";
import Deals50 from "./Deals50";
import ValueDeals from "./ValueDeals";
import MedicineList from "./MedicineList";

import medicines from "./medicines";
import valueProducts from "./valueProducts";

import "./style/medicine.css";

export default function MedicinePage({ addToCart }) {
return (
<main>
<MedicineHero />
<QuickOptions />
<Conditions />
<Brands />
<Deals50 addToCart={addToCart} />
<ValueDeals products={valueProducts} addToCart={addToCart} />
<MedicineList medicines={medicines} addToCart={addToCart} />
</main>
);
}