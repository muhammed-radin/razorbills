
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
    <section >
      <div className="container ">
        <div className=" grid gap-8  lg:grid-cols-2 ">
          <div
            className="flex flex-col  text-center lg:items-start lg:text-left">
          
            <h1 className="mb-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div
              className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full p-6  sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
             
            </div>
          </div>
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-96 w-full rounded-md object-cover " />
        </div>
      </div>
    </section>
  );
};

export { Hero1 };