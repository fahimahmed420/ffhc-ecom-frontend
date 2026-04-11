import ProductClient from "./ProductClient";

export const revalidate = 60;

async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${id}`,
      {
        cache: "no-store", // safer for debugging
      }
    );

    const data = await res.json();

    if (!res.ok || !data?.product) return null;

    return {
      product: data.product,
      related: data.related || [],
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default async function Page({ params }) {
  const { id } = await params;

  if (!id) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Invalid product id
      </p>
    );
  }

  const data = await getProduct(id);

  if (!data?.product) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Product not found
      </p>
    );
  }

  return <ProductClient initialData={data} />;
}