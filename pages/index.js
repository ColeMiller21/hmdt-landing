import About from "../components/Sections/About";
import Landing from "../components/Sections/Landing";
import FAQ from "../components/Sections/FAQ";
import SEO from "../components/SEO";
import { hmpeQuestions } from "../data/faq/hmpeFAQ";

export default function Home() {
  return (
    <>
      <SEO
        title="Help Me Debug This"
        description="Something is fundamentally wrong. H3lp M3 D3bu8 Th15! This is the website for the Genesis Collection for the !Debog Universe"
      />
      <div className="w-full flex flex-col gap-[2rem]">
        <Landing />
        <About />
        <FAQ faqQuestions={hmpeQuestions} title="General FAQs" />
      </div>
    </>
  );
}
