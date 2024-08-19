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
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  numberOfBoids: z.coerce.number().int().gte(0),
});

type FormSchema = z.infer<typeof FormSchema>;

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

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numberOfBoids: 200,
    },
    mode: "all",
  });

  return (
    <div ref={ref} className="grow self-stretch relative">
      <div
        id="overlay"
        className="absolute p-2 flex flex-col right-2 top-2 bg-slate-950 text-slate-50 w-60 bg-opacity-40 rounded"
      >
        <span id="fps" className="text-end">
          fps
        </span>
        <Form {...form}>
          <FormField
            control={form.control}
            name="numberOfBoids"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Number of boids</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={0}
                      max={1000}
                      step={1}
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                    />
                    <FormControl>
                      <Input className="h-6 w-14" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </Form>
      </div>
    </div>
  );
}
