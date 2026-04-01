import FaqAccordion from "../components/FaqAccordion";
import { useAppData } from "../context/AppDataContext";
import { contentValue } from "../lib/siteDefaults";

function FaqPage() {
  const { faqs, siteContent } = useAppData();

  return (
    <div className="section-shell py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{contentValue(siteContent, "faq_badge")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {contentValue(siteContent, "faq_title")}
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600">
          {contentValue(siteContent, "faq_intro")}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}

export default FaqPage;
