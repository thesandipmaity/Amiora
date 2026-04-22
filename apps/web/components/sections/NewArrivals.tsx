import React from "react";

interface Product {
  id: string | number;
  title: string;
  image: string;
  price: number | string;
}

const ProductGridSection = ({ products = [] }: { products: Product[] }) => {
  return (
    <section className="w-full px-4 py-8">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        {products.slice(0, 10).map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold">{product.title}</h3>
              <p className="text-gray-500 text-sm">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGridSection;