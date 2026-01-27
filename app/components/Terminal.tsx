'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'system' | 'question' | 'answer' | 'error' | 'loading';
  text: string;
}

interface Question {
  id: string;
  question: string;
  placeholder?: string;
  validate?: (value: string) => string | null;
}

const questions: Question[] = [
  {
    id: 'name',
    question: '> Nombre completo:',
    placeholder: 'Tu nombre...',
    validate: (v) => v.trim().length < 2 ? 'Nombre demasiado corto' : null
  },
  {
    id: 'email',
    question: '> Email:',
    placeholder: 'tu@email.com',
    validate: (v) => !v.includes('@') ? 'Email inválido' : null
  },
  {
    id: 'phone',
    question: '> Teléfono / WhatsApp:',
    placeholder: '+34 XXX XXX XXX'
  },
  {
    id: 'project',
    question: '> ¿En qué proyecto estás trabajando? (2-3 frases)',
    placeholder: 'Describe tu proyecto...'
  },
  {
    id: 'experience',
    question: '> ¿Cómo te describes?\n  [1] Vibe Coder (IA/no-code)\n  [2] Indie Hacker\n  [3] Developer profesional\n  [4] Maker / Builder\n  [5] Otro\n> Elige número(s) separados por comas:',
    placeholder: 'Ej: 1,2'
  },
  {
    id: 'accommodation',
    question: '> ¿Necesitas alojamiento?\n  [1] Sí, necesito alojamiento\n  [2] No, tengo alojamiento\n> Elige 1 o 2:',
    placeholder: '1 o 2',
    validate: (v) => !['1', '2'].includes(v.trim()) ? 'Responde 1 o 2' : null
  },
  {
    id: 'dietary',
    question: '> ¿Alergias o restricciones alimentarias?',
    placeholder: 'Ninguna, Vegetariano, Vegano, etc.'
  },
  {
    id: 'referral',
    question: '> ¿Cómo nos conociste? (opcional)',
    placeholder: 'Twitter, amigo, etc.'
  },
  {
    id: 'days',
    question: '> ¿Qué días puedes venir?\n  [1] Viernes 18\n  [2] Sábado 19\n  [3] Domingo 20\n  [4] Lunes 21\n  [5] Martes 22\n> Números separados por comas:',
    placeholder: 'Ej: 1,2,3,4,5'
  },
  {
    id: 'loom',
    question: '> Graba un Loom (<2 min) explicando por qué deberíamos elegirte.\n> Comparte el link de tu video:',
    placeholder: 'https://www.loom.com/share/...',
    validate: (v) => {
      if (!v.trim()) return 'El video de Loom es obligatorio';
      if (!v.includes('loom.com')) return 'Debe ser un link de Loom válido';
      return null;
    }
  },
  {
    id: 'comments',
    question: '> ¿Algo más que quieras contarnos? (opcional)',
    placeholder: 'Comentarios adicionales...'
  }
];

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasBooted = useRef(false);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when not typing
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping, currentQuestion]);

  // Initialize terminal with boot sequence (only once)
  useEffect(() => {
    if (!hasBooted.current) {
      hasBooted.current = true;
      bootSequence();
    }
  }, []);

  const bootSequence = async () => {
    // Boot messages
    await addLine({ type: 'system', text: '> Inicializando sistema de registro...' }, 300);
    await addLine({ type: 'loading', text: '> ' }, 800); // Loading dots
    await removeLine(); // Remove loading
    await addLine({ type: 'system', text: '> ✓ Conexión establecida' }, 200);
    await addLine({ type: 'system', text: '> Hacker House Registration System v2.0' }, 400);
    await addLine({ type: 'system', text: '> ' }, 100);
    await addLine({ type: 'system', text: '> Responde las siguientes preguntas. Presiona ENTER para enviar cada respuesta.' }, 600);
    await addLine({ type: 'system', text: '> ' }, 300);

    // Show first question with typing effect
    await showQuestionWithTyping(questions[0].question);
  };

  const addLine = (line: TerminalLine, delay: number = 0): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        resolve();
      }, delay);
    });
  };

  const removeLine = (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLines(prev => prev.slice(0, -1));
        resolve();
      }, 0);
    });
  };

  const showQuestionWithTyping = async (questionText: string) => {
    setIsTyping(true);
    const questionLines = questionText.split('\n');

    for (const line of questionLines) {
      // Type each character
      let currentText = '';
      for (let i = 0; i < line.length; i++) {
        currentText += line[i];

        // Update the last line or add new one
        if (i === 0) {
          await addLine({ type: 'question', text: currentText }, 0);
        } else {
          setLines(prev => {
            const newLines = [...prev];
            newLines[newLines.length - 1] = { type: 'question', text: currentText };
            return newLines;
          });
          await new Promise(resolve => setTimeout(resolve, 30)); // Speed of typing
        }
      }
    }

    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTyping) return;

    const currentQ = questions[currentQuestion];
    const trimmedInput = input.trim();

    // Validation
    if (currentQ.validate) {
      const error = currentQ.validate(trimmedInput);
      if (error) {
        await addLine({ type: 'error', text: `! ERROR: ${error}` }, 0);
        setInput('');
        return;
      }
    }

    // Optional questions
    const isOptional = currentQ.question.includes('opcional');
    if (!trimmedInput && !isOptional) {
      await addLine({ type: 'error', text: '! ERROR: Campo requerido' }, 0);
      setInput('');
      return;
    }

    // Save answer
    const newAnswers = { ...answers, [currentQ.id]: trimmedInput };
    setAnswers(newAnswers);
    await addLine({ type: 'answer', text: `> ${trimmedInput || '(vacío)'}` }, 0);
    setInput('');

    // Next question or finish
    if (currentQuestion < questions.length - 1) {
      await addLine({ type: 'system', text: '>' }, 200);

      // Show loading while "thinking"
      await addLine({ type: 'loading', text: '> ' }, 400);
      await removeLine(); // Remove loading

      setCurrentQuestion(prev => prev + 1);
      await showQuestionWithTyping(questions[currentQuestion + 1].question);
    } else {
      // Finished - send data
      await submitForm({ ...newAnswers, [currentQ.id]: trimmedInput });
    }
  };

  const submitForm = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    await addLine({ type: 'system', text: '>' }, 300);
    await addLine({ type: 'loading', text: '> ' }, 500);

    try {
      // URL del Google Apps Script (Web App)
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (!GOOGLE_SCRIPT_URL) {
        throw new Error('Google Script URL not configured');
      }

      // Enviar datos a Google Sheets usando text/plain para evitar CORS preflight
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(formData),
      });

      // Con no-cors no podemos leer la respuesta, pero si llega aquí es que funcionó
      await removeLine(); // Remove loading
      await addLine({ type: 'system', text: '> ✓ Registro completado exitosamente' }, 200);
      await addLine({ type: 'system', text: '> ✓ Te contactaremos en 24-48h a: ' + formData.email }, 300);
      await addLine({ type: 'system', text: '>' }, 200);
      await addLine({ type: 'system', text: '> Resumen de tu aplicación:' }, 300);
      await addLine({ type: 'answer', text: `  Nombre: ${formData.name}` }, 100);
      await addLine({ type: 'answer', text: `  Email: ${formData.email}` }, 100);
      await addLine({ type: 'answer', text: `  Proyecto: ${formData.project}` }, 100);
      await addLine({ type: 'answer', text: `  Video: ${formData.loom}` }, 100);
      await addLine({ type: 'system', text: '>' }, 200);
      await addLine({ type: 'system', text: '> Presiona ESC para cerrar' }, 0);

      console.log('Form Data submitted:', formData);

    } catch (error) {
      await removeLine(); // Remove loading
      await addLine({ type: 'error', text: '! ERROR: No se pudo enviar el formulario' }, 0);
      await addLine({ type: 'error', text: '! Intenta de nuevo o escribe a: byferromero@gmail.com' }, 0);
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-black border-2 flex flex-col" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 50px rgba(134, 239, 172, 0.3)' }}>
        {/* Terminal Header */}
        <div className="border-b-2 px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'var(--dark-gray)', borderColor: 'var(--neon-green)' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--neon-green)' }}></div>
            <span className="ml-4 text-sm font-mono" style={{ color: 'var(--neon-green)' }}>
              terminal@hackerhouse:~/register
            </span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-red-500 transition-colors text-lg font-bold"
            style={{ color: 'var(--neon-green)' }}
          >
            [X]
          </button>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.type === 'system' ? 'var(--neon-blue)' :
                       line.type === 'question' ? 'var(--neon-green)' :
                       line.type === 'answer' ? 'var(--foreground)' :
                       line.type === 'error' ? 'var(--neon-pink)' :
                       line.type === 'loading' ? 'var(--neon-blue)' :
                       'var(--foreground)'
              }}
            >
              {line.type === 'loading' ? (
                <span className="loading-dots">
                  {line.text}<span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                line.text
              )}
            </div>
          ))}

          {/* Input Line */}
          {!isSubmitting && !isTyping && currentQuestion < questions.length && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
              <span style={{ color: 'var(--neon-green)' }}>&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={questions[currentQuestion]?.placeholder}
                className="flex-1 bg-transparent outline-none font-mono placeholder:opacity-30"
                style={{ color: 'var(--foreground)' }}
                autoComplete="off"
              />
              <span className="animate-pulse" style={{ color: 'var(--neon-green)' }}>▋</span>
            </form>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="border-t-2 px-4 py-2 text-xs font-mono" style={{ backgroundColor: 'var(--dark-gray)', borderColor: 'var(--neon-green)', color: 'var(--neon-blue)' }}>
          <div className="flex justify-between">
            <span>Pregunta {Math.min(currentQuestion + 1, questions.length)}/{questions.length}</span>
            <span>ESC para salir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
