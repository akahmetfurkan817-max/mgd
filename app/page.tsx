import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DynamicHomeSections from "@/components/home/DynamicHomeSections";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <DynamicHomeSections />
      </main>
      <Footer />
    </>
  );
}
