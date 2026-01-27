'use client';

import { useState } from 'react';
import Terminal from './components/Terminal';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <>
      <div className="scanlines min-h-screen">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-4xl w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm md:text-base mb-2">&gt; connection established_</p>
              <p className="text-neon-blue text-sm md:text-base mb-4">&gt; loading hackerhouse.exe...</p>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold mb-6 glitch text-foreground">
              HACKER HOUSE
            </h1>

            <div className="border-l-4 border-neon-green pl-6 mb-8">
              <p className="text-2xl md:text-4xl neon-glow mb-4">
                SEVILLA 2026
              </p>
              <p className="text-xl md:text-2xl text-neon-blue mb-2">
                18 - 22 ABRIL
              </p>
              <p className="text-base md:text-lg text-neon-purple">
                5 días // 10 builders // 1 casa
              </p>
            </div>

            <p className="text-base md:text-xl mb-8 text-foreground/80 max-w-2xl">
              Un retiro de 5 días en Sevilla donde builders construyen proyectos,
              comparten código y disfrutan de la Feria de Abril.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowTerminal(true)}
                className="btn-neon text-center"
              >
                Aplicar ahora
              </button>
              <a
                href="#about"
                className="btn-neon border-neon-blue text-neon-blue hover:bg-neon-blue text-center"
              >
                Leer más
              </a>
            </div>

            <div className="mt-12 text-sm text-neon-green">
              <span className="cursor">&gt; slots_available: 10/10</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center px-4 py-20 bg-dark-gray/30">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm mb-2">&gt; cat about.txt</p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-neon-blue">
              ¿QUÉ ES ESTO?
            </h2>

            <div className="space-y-6 text-base md:text-lg">
              <p className="text-foreground/90">
                <span className="text-neon-purple">$</span> Hacker House es un retiro de 5 días donde builders que construyen cosas
                se juntan a trabajar en sus proyectos en un ambiente relajado y productivo.
              </p>

              <p className="text-foreground/90">
                <span className="text-neon-purple">$</span> No es un hackathon competitivo. No es networking forzado.
                Es simplemente gente que construye, comparte conocimiento y aprende juntos.
              </p>

              <div className="border border-neon-green/30 p-6 mt-8">
                <p className="text-neon-green mb-4 font-bold">// PERFIL IDEAL</p>
                <ul className="space-y-2 text-foreground/80">
                  <li><span className="text-neon-green">→</span> Vibe coders que construyen con IA</li>
                  <li><span className="text-neon-green">→</span> Indie hackers con side projects</li>
                  <li><span className="text-neon-green">→</span> Developers trabajando en algo propio</li>
                  <li><span className="text-neon-green">→</span> Makers que quieren avanzar sus ideas</li>
                </ul>
              </div>

              <p className="text-foreground/90">
                <span className="text-neon-purple">$</span> La casa está en Sevilla y coincide con la Feria de Abril.
                Trabajo durante el día, Feria por la noche (opcional).
              </p>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm mb-2">&gt; ls -la schedule/</p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-neon-purple">
              AGENDA
            </h2>

            <div className="space-y-6">
              {[
                {
                  day: "VIERNES 18",
                  title: "setup.sh",
                  desc: "Check-in a partir de las 18:00. Cena de bienvenida y presentaciones.",
                  color: "neon-green"
                },
                {
                  day: "SÁBADO 19",
                  title: "build.sh",
                  desc: "Día completo de trabajo. Cada uno en su proyecto. Comida compartida.",
                  color: "neon-blue"
                },
                {
                  day: "DOMINGO 20",
                  title: "code.sh",
                  desc: "Más construcción. Por la noche, opcional visita a la Feria.",
                  color: "neon-purple"
                },
                {
                  day: "LUNES 21",
                  title: "ship.sh",
                  desc: "Sprint final. Feedback sessions. Cena en la Feria (opcional).",
                  color: "neon-pink"
                },
                {
                  day: "MARTES 22",
                  title: "demo.sh",
                  desc: "Última mañana. Show & tell de lo construido. Check-out 14:00.",
                  color: "neon-green"
                }
              ].map((day, i) => (
                <div
                  key={i}
                  className="border-l-4 border-neon-green/50 pl-6 py-4 hover:border-neon-green transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <span className="text-neon-green font-bold text-lg">{day.day}</span>
                    <span className={`text-${day.color} text-xl font-mono`}>./{day.title}</span>
                  </div>
                  <p className="text-foreground/70">{day.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 border border-neon-blue/30 p-6">
              <p className="text-neon-blue mb-2">// NOTA</p>
              <p className="text-foreground/80 text-sm">
                La agenda es flexible. No hay horarios estrictos. Cada uno trabaja a su ritmo.
                El objetivo es crear un ambiente productivo sin presión.
              </p>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="min-h-screen flex items-center px-4 py-20 bg-dark-gray/30">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm mb-2">&gt; pwd</p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-neon-green">
              UBICACIÓN
            </h2>

            <div className="space-y-6 text-base md:text-lg">
              <p className="text-foreground/90">
                <span className="text-neon-purple">📍</span> Sevilla, España
              </p>

              <p className="text-foreground/80">
                La casa está en Sevilla y tiene capacidad para 13 personas (host + 12 invitados).
                Espacio de trabajo, WiFi de fibra, y todo lo necesario para construir.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="border border-neon-green/30 p-6">
                  <p className="text-neon-green mb-4 font-bold">✓ INCLUIDO</p>
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li>→ Alojamiento (habitación compartida)</li>
                    <li>→ Desayunos y comidas</li>
                    <li>→ Espacio de trabajo</li>
                    <li>→ WiFi fibra 1Gb</li>
                    <li>→ Café ilimitado ☕</li>
                  </ul>
                </div>

                <div className="border border-neon-purple/30 p-6">
                  <p className="text-neon-purple mb-4 font-bold">⚡ EXTRAS</p>
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li>→ Monitores extra disponibles</li>
                    <li>→ Regletas y enchufes</li>
                    <li>→ Parking disponible</li>
                    <li>→ 15 min centro de Sevilla</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-foreground/60 mt-6">
                * La dirección exacta se enviará a asistentes confirmados
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm mb-2">&gt; cat faq.md</p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-neon-blue">
              FAQ
            </h2>

            <div className="space-y-8">
              {[
                {
                  q: "¿Cuánto cuesta?",
                  a: "El evento tiene un coste aproximado de 50-80€ por persona para cubrir comida, limpieza y gastos. Lo calculamos al final y dividimos entre todos."
                },
                {
                  q: "¿Necesito saber programar?",
                  a: "No hace falta ser developer profesional. Si estás construyendo algo (con IA, no-code, o código tradicional), eres bienvenido."
                },
                {
                  q: "¿Necesito traer algo?",
                  a: "Tu laptop, cargador, y ganas de construir. Todo lo demás está cubierto (ropa de cama, toallas, etc)."
                },
                {
                  q: "¿Tengo que estar los 5 días completos?",
                  a: "Idealmente sí, pero entendemos si solo puedes estar algunos días. Indícalo en el formulario."
                },
                {
                  q: "¿Hay que trabajar en equipo?",
                  a: "No necesariamente. Cada uno trabaja en su proyecto. Pero si quieres colaborar o pedir feedback, adelante."
                },
                {
                  q: "¿Qué pasa con la Feria?",
                  a: "La Feria está ahí si quieres ir por la noche. Es totalmente opcional. No hay presión."
                }
              ].map((faq, i) => (
                <div key={i} className="border-l-4 border-neon-blue/50 pl-6">
                  <p className="text-neon-green font-bold mb-2 text-lg">&gt; {faq.q}</p>
                  <p className="text-foreground/80">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Register Section */}
        <section id="register" className="min-h-screen flex items-center px-4 py-20 bg-dark-gray/30">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <p className="text-neon-green text-sm mb-2">&gt; ./register.sh</p>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-neon-purple">
              APLICA AHORA
            </h2>

            <div className="space-y-6 text-base md:text-lg mb-12">
              <p className="text-foreground/90">
                Plazas limitadas: <span className="text-neon-green font-bold">10 personas</span>
              </p>

              <p className="text-foreground/80">
                Inicia el terminal de registro y responde las preguntas. Es rápido y directo.
              </p>

              <div className="border border-neon-pink/30 p-6">
                <p className="text-neon-pink mb-2 font-bold">⚠️ IMPORTANTE</p>
                <p className="text-foreground/80 text-sm">
                  Este es un evento pequeño y personal. Buscamos gente que esté realmente construyendo algo
                  y quiera aprovechar estos días para avanzar en sus proyectos.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setShowTerminal(true)}
                className="btn-neon text-xl py-6 px-12"
              >
                Iniciar registro →
              </button>

              <p className="text-sm text-foreground/60">
                O envía un email a: <span className="text-neon-blue">byferromero@gmail.com</span>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neon-green/20 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-neon-green font-bold mb-2">HACKER HOUSE // SEVILLA 2026</p>
                <p className="text-sm text-foreground/60">18-22 Abril // 10 builders // 1 casa</p>
              </div>

              <div className="flex gap-6 text-sm">
                <a href="mailto:byferromero@gmail.com" className="text-neon-blue hover:text-neon-green transition-colors">
                  Email
                </a>
                <a href="https://twitter.com/yourhandle" className="text-neon-blue hover:text-neon-green transition-colors">
                  Twitter
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-foreground/40">
              <p>&gt; built_with_❤️_by_fer</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Terminal Modal */}
      {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
    </>
  );
}
