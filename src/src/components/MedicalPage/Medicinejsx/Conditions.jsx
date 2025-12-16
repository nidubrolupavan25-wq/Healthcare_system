
import "../MedicineStyling/Conditions.css";
export default function Conditions() {
  const items = [
    {
      name: "Diabetes Care",
      img: "https://static.vecteezy.com/system/resources/previews/054/655/042/non_2x/a-hand-holding-a-cell-phone-with-a-blood-drop-on-it-free-png.png",
    },
    {
      name: "Cardiac Care",
      img: "https://img.icons8.com/color/48/heart-health.png",
    },
    {
      name: "Stomach Care",
      img: "https://img.icons8.com/color/48/stomach.png",
    },
    {
      name: "Pain Relief",
      img: "https://png.pngtree.com/png-clipart/20240324/original/pngtree-knee-joint-bones-pain-png-image_14670869.png",
    },
    {
      name: "Liver Care",
      img: "https://img.icons8.com/color/48/liver.png",
    },
    {
      name: "Oral Care",
      img: "https://img.icons8.com/color/48/tooth.png",
    },
    {
      name: "Respiratory",
      img: "https://img.icons8.com/color/48/lungs.png",
    },
    {
      name: "Cold & Immunity",
      img: "https://img.icons8.com/color/48/health-checkup.png",
    },
  ];

  return (
    <section className="conditions">
      <h2>Browse by Health Conditions</h2>
      <div className="condition-grid">
        {items.map((item) => (
          <div
            key={item.name}
            className="condition-box"
            role="button"
            aria-label={item.name}
          >
            <img src={item.img} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
