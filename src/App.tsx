import { useEffect, useRef } from "react";
import { setupScene } from "./scene/setupScene";
import { ThemeProvider } from "./components/themeProvider";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Slider } from "@radix-ui/react-slider";
import { Input } from "./components/ui/input";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="fixed inset-0 flex flex-col">
        <h1>Flocking Behaviour</h1>
        <ThreeContaier />
      </div>
    </ThemeProvider>
  );
}

function ThreeContaier() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const clean = setupScene(target);

    return () => {
      clean();
    };
  }, []);

  const form = useForm({
    defaultValues: {
      numberOfBoids: "200",
    },
    values: {
      numberOfBoids: "200",
    },
  });

  return (
    <div ref={ref} className="grow self-stretch relative">
      <div
        id="overlay"
        className="absolute text-end p-1 flex flex-col right-4 top-4 bg-slate-700 text-slate-50"
      >
        <span id="fps">fps</span>
        <Form {...form}>
          <FormField
            control={form.control}
            name="numberOfBoids"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-1 items-center">
                <FormLabel>Number of boids</FormLabel>
                <FormControl>
                  <Input className="h-6" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
    </div>
  );
}
