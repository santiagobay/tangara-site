import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { SoundFX } from "@/components/Sound";
import { TemplateBar, TemplateMotion } from "@/components/templates/Kit";
import Restaurant from "@/components/templates/Restaurant";
import RealEstate from "@/components/templates/RealEstate";
import Store from "@/components/templates/Store";
import Construction from "@/components/templates/Construction";
import { templates, templateBySlug } from "@/lib/templates";
import "../templates.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = templateBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.industry} website template`,
    description: `${t.pitch} A Tangara website template with a fictional brand.`,
    alternates: { canonical: `/templates/${t.slug}` },
  };
}

const views = { restaurant: Restaurant, "real-estate": RealEstate, store: Store, construction: Construction };

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const t = templateBySlug(slug);
  if (!t) notFound();
  const View = views[t.slug];
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <SoundFX />
      <TemplateBar industry={t.industry} />
      <main>
        <View />
      </main>
      <TemplateMotion />
    </>
  );
}
