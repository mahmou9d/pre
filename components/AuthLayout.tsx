import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Visual side */}
      <aside className="hidden lg:flex relative bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ink" />
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-burnt/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-burnt-glow/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-[20%] p-12 w-full text-cream">
          <Link
            href="/"
            className="font-display font-black text-3xl"
          >
            D R O P P Z
          </Link>

          <div className="space-y-6">
            <p className="text-burnt font-bold text-sm uppercase">
              Streetwear · مصري
            </p>
            <h2 className="font-display font-black text-5xl xl:text-6xl leading-tight text-balance">
              انضم لعائلة DROPPZ
              <br />
              <span className="text-burnt">واطلب أسرع.</span>
            </h2>
            <p className="text-cream/70 text-lg max-w-md leading-relaxed">
              تابع طلباتك، احفظ مقاساتك المفضلة، واستفيد من عروض حصرية للأعضاء
              فقط.
            </p>
          </div>
        </div>
      </aside>

      {/* Form side */}
      <section className="flex flex-col px-6 py-10 sm:px-12 lg:px-16">
        <Link
          href="/"
          className="lg:hidden font-display font-black text-2xl  text-ink mb-10"
        >
          DROPPZ
        </Link>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto animate-fade-up">
            <div className="mb-8">
              <h1 className="font-display font-black text-4xl text-ink mb-2">
                {title}
              </h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            <div className="mt-8 text-sm text-center text-muted-foreground">
              {footer}
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          © {new Date().getFullYear()} DROPPZ جميع الحقوق محفوظة.
        </p>
      </section>
    </main>
  );
};

export default AuthLayout;
