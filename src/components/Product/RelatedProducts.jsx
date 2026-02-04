import Product from "./Product";
import classes from './RelatedProducts.module.css'

export default function RelatedProducts() {

  //TODO: get all related products minus the one being displayed via api
const products = [
  {
    id: 5,
    name: "Device Contract",
    description:
      "Allows the customer to take out a device on contract - such as a phone, laptop etc.",
    price: 850,
    imageUrl: "",
  },
  {
    id: 6,
    name: "Short-Term Investment Product",
    description:
      "Provides a way for customers to invest their money over a short period of time - 32 day fixed deposit etc.",
    price: 2500,
    imageUrl: "",
  },
  {
    id: 7,
    name: "Long-Term investment Product",
    description:
      "Provides a way for users to invest their money over the long term - Retirement / Annuity Funds, Unit Trusts etc",
    price: 5000,
    imageUrl: "",
  },
  {
    id: 8,
    name: "Islamic Investment Product",
    description: "Provides a way for Islamic customers to invest their money",
    price: 5000,
    imageUrl: "",
  },
  {
    id: 9,
    name: "VIP Investment Product",
    description:
      "Provides an Investment product for VIP customers Over 150 Million Net-Asset Value",
    price: 20000,
    imageUrl: "",
  },
  {
    id: 1,
    name: "Retail Short Term Insurance",
    description:
      "Provides cover for short-term products for individuals - Electronics, Household Items, Jewellery, Cars etc.",
    price: 500,
    imageUrl: "",
  },
  {
    id: 2,
    name: "Retail Long-Term Insurance",
    description:
      "Provides cover for longer term products individuals - household insurance, life insurance etc.",
    price: 1000,
    imageUrl: "",
  },
  {
    id: 3,
    name: "Commercial Short Term Insurance",
    description:
      "Provides cover for short-term products for commercial entities - Printers, Company Cars, Theft,  etc.",
    price: 5000,
    imageUrl: "",
  },
  {
    id: 4,
    name: "Commercial Long-Term Insurance",
    description:
      "Provides cover for longer term products - office insurance, employee benefit insurance, etc.",
    price: 10000,
    imageUrl: "",
  },
];


  return (
    <section className={classes.related}>
      <h3>Related products</h3>
      <div className={classes.relatedGrid}>
        {products.map((p) => (
          <Product key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}