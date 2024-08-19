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
import {
  defaultSimulationParameters,
  setSimulationParameters,
  SimulationParameters,
} from "./scene/simulationParameters";

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

  const form = useForm<SimulationParameters>({
    resolver: zodResolver(SimulationParameters),
    defaultValues: defaultSimulationParameters,
    mode: "all",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        setSimulationParameters(value);
      } catch {
        //
      }
    });

    return subscription.unsubscribe;
  }, [form]);

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
          <FormField
            control={form.control}
            name="separationRadius"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Separation radius</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={0}
                      max={40}
                      step={0.01}
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
          <FormField
            control={form.control}
            name="separationForce"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Separation force</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={-40}
                      max={40}
                      step={0.01}
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
          <FormField
            control={form.control}
            name="alignmentRadius"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Alignment radius</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={0}
                      max={40}
                      step={0.01}
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
          <FormField
            control={form.control}
            name="alignmentForce"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Alignment force</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={-40}
                      max={40}
                      step={0.01}
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
          <FormField
            control={form.control}
            name="cohesionRadius"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Cohesion radius</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={0}
                      max={40}
                      step={0.01}
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
          <FormField
            control={form.control}
            name="cohesionForce"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Cohesion force</FormLabel>
                  <div className="flex gap-1">
                    <Slider
                      min={-40}
                      max={40}
                      step={0.01}
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
