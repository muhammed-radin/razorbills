import { Button } from "@/components/ui/button";

const Hero1 = ({
  heading = "razorbill",
  description = "Lorem ipsum dolor sit amet error similique optio minima! Laudantium nam fuga recusaducimus?",
  buttons = {
    primary: {
      text: "Shop now",
    },
  },
  image = {
    src: "https://tse3.mm.bing.net/th/id/OIP.NM9iYT_-Fph7FlPEp-2SoQHaEx?w=626&h=403&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Hero section demo image showing interface components",
  }
}) => {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start pt-2">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto px-8 py-6 text-base">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
            </div>
          </div>
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto max-h-96 rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero1 };