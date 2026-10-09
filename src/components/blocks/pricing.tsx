"use client";

import { useState } from "react";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Mapa",
    monthlyPrice: "04",
    yearlyPrice: "04",
    description: "Grátis para todos",
    features: [
      "4 funções no mapa",
      "3 modos",
      "Cérebro 3D",
      "Relações e fontes registradas",
    ],
  },
  {
    name: "Artigos",
    monthlyPrice: "12",
    yearlyPrice: "04",
    features: [
      "Tudo do mapa e, além disso...",
      "Guia de uso",
      "Leituras breves",
      "Funções executivas na sua rotina.",
      "Riscos cognitivos",
      "Referências",
    ],
  },
  {
    name: "Ferramenta",
    monthlyPrice: "12",
    yearlyPrice: "04",
    features: [
      "Tudo do mapa e, além disso...",
      "Guia de uso",
      "Passos bem claros",
      "Prioridade de um só foco",
      "Rever passo a passo",
    ],
  },
];

export const Pricing = ({ className }: { className?: string }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Comece.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
            Cada modo é um filtro sobre o mesmo grafo; o fator no centro não
            muda. Escolha onde quer começar e siga no seu ritmo, pouco a pouco.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${
                plan.name === "Artigos"
                  ? "outline-primary origin-top outline-4"
                  : ""
              }`}
            >
              <CardContent className="flex flex-col gap-7 px-6 py-5">
                <div className="space-y-2">
                  <h3 className="text-foreground font-semibold">{plan.name}</h3>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-lg font-medium">
                      {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}{" "}
                      {plan.name !== "Mapa" && (
                        <span className="text-muted-foreground">
                          por tema/
                          {isAnnual ? "guia" : "texto"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {plan.name !== "Mapa" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={() => setIsAnnual(!isAnnual)}
                      aria-label="Toggle annual billing"
                    />
                    <span className="text-sm font-medium">Contar em guias</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {plan.description}
                  </span>
                )}

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="text-muted-foreground flex items-center gap-1.5"
                    >
                      <Check className="size-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-fit"
                  variant={plan.name === "Artigos" ? "default" : "outline"}
                >
                  Começar já.
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
