import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/consts";

const features = [
  {
    title: "Planejar o caminho",
    description: "Organizar etapas e decidir por onde começar uma tarefa.",
    icon: CircleDot,
  },
  {
    title: "Controle inibitório",
    description: "Conter distrações e sustentar o seu foco.",
    icon: Blend,
  },
  {
    title: "Lembrar-se",
    description: "Manter as etapas na mente durante a ação.",
    icon: Diamond,
  },
  {
    title: "Adaptar os planos",
    description: "Mudar de direção sem perder a ordem da tarefa.",
    icon: ChartNoAxesColumn,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
            Intenção vira execução.
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
            Você sabe o que precisa fazer, mas nem sempre consegue sair do plano
            e ir para a ação?
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild>
              <a href={GITHUB_URL}>Abrir o mapa</a>
            </Button>
            <Button
              variant="outline"
              className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <a
                href="https://shadcnblocks.com"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Gestão de risco cognitivo
                <ArrowRight className="stroke-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mt-12 md:mt-20 lg:mt-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl tracking-tight md:text-3xl">O cérebro por trás da execução.</h2>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Anatomia, estruturas e conexões neurais em imagens ilustrativas.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: "/brain-visuals/anatomia-lateral.webp",
              eyebrow: "01 · Anatomia",
              label: "Estruturas cerebrais",
              alt: "Ilustração anatômica lateral do encéfalo e da região cervical",
            },
            {
              src: "/brain-visuals/atlas-encefalico.webp",
              eyebrow: "02 · Contexto",
              label: "Visão em camadas",
              alt: "Atlas anatômico ilustrado de estruturas encefálicas e cervicais",
            },
            {
              src: "/brain-visuals/rede-sinaptica.webp",
              eyebrow: "03 · Conexões",
              label: "Rede neural",
              alt: "Ilustração em malha de uma conexão entre células nervosas",
            },
          ].map((visual) => (
            <figure
              key={visual.src}
              className="bg-background overflow-hidden rounded-3xl border shadow-sm"
            >
              <div className="bg-[#F7F7F7] aspect-[4/3] overflow-hidden p-3">
                <img
                  src={visual.src}
                  alt={visual.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
              <figcaption className="border-t p-5">
                <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                  {visual.eyebrow}
                </span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {visual.label}
                </h3>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
          Referências ilustrativas; não representam uma localização isolada das funções executivas nem permitem diagnóstico.
        </p>
      </div>
    </section>
  );
};
