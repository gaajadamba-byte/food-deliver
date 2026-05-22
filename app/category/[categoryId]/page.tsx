import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { CategoryFoods } from "@/components/category/CategoryFoods";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <CategoryFoods categoryId={categoryId} />
      </main>
      <Footer />
    </>
  );
}
