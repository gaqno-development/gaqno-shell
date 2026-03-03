import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import {
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";

export default function RecoveryPassPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <Card className="relative w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            Recuperar senha
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Informe seu e-mail para receber o link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11 text-base"
            >
              Enviar link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-6 border-t border-white/10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
