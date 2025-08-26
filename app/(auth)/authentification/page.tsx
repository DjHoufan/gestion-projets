"use client";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";

import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthSchema, AuthSchemaInput } from "@/core/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/core/hooks/use-auth";
import { useState } from "react";
import { Spinner } from "@/core/components/ui/spinner";
import { BookOpen, Shield, Users } from "lucide-react";
import Image from "next/image";

const Authentification = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<AuthSchemaInput>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = async (value: AuthSchemaInput) => {
    login({ json: value });
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="px-10 py-4  bg-gradient-to-r from-teal-500/20 to-teal-500/20  rounded-lg">
                <Image
                  src="/images/houfan-new-logo.png"
                  alt="HOUFAN Research & Transform"
                  width={200}
                  height={100}
                  className="h-20 w-auto"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-600 mt-2">
              Accédez à votre plateforme de formation
            </p>
          </div>

          <Card className=" shadow">
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormLabel className="pl-5 text-sm font-medium text-gray-700">
                            Email
                          </FormLabel>
                          <Mail className="absolute  top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                        </div>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="email"
                            placeholder="votre@email.com"
                            className="h-12 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormLabel className="pl-5 text-sm font-medium text-gray-700">
                            Mot de passe
                          </FormLabel>

                          <Lock className="absolute  top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              disabled={isPending}
                              type={showPassword ? "text" : "password"}
                              placeholder="Votre mot de passe"
                              className=" h-12 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all rounded-xl pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white transition-all"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        Connexion en cours
                        <Spinner variant="ellipsis" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Se connecter
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1  bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">Bienvenue sur HOUFAN</h2>
              <p className="text-xl text-orange-100 leading-relaxed">
                Votre plateforme de formation professionnelle nouvelle
                génération
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Formations Personnalisées</h3>
                  <p className="text-orange-100 text-sm">
                    Accédez à des formations adaptées à vos besoins
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Collaboration d&apos;Équipe</h3>
                  <p className="text-orange-100 text-sm">
                    Travaillez ensemble sur vos projets de formation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Sécurité Avancée</h3>
                  <p className="text-orange-100 text-sm">
                    Vos données sont protégées par les dernières technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default Authentification;
