import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Básicos",
    questions: [
      {
        question: "O mapa cognitivo faz algum tipo de diagnóstico médico?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
      {
        question: "Posso usar o mapa no lugar de uma avaliação médica?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
      {
        question: "O site substitui um acompanhamento?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
    ],
  },
  {
    title: "Sobre o mapa",
    questions: [
      {
        question: "Posso usar o mapa no lugar de uma avaliação médica?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
      {
        question: "O site substitui um acompanhamento?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
    ],
  },
  {
    title: "Outras questões",
    questions: [
      {
        question: "Posso usar o mapa no lugar de uma avaliação médica?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
      {
        question: "O site substitui um acompanhamento?",
        answer:
          "Não. O mapa organiza uma forma operacional de ler a execução. Não é diagnóstico e não substitui avaliação clínica.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Dúvidas comuns
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Dúvidas comuns
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              Se não encontrou aqui o que está buscando,{" "}
              <a href="/contact" className="underline underline-offset-4">
                fale conosco
              </a>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
