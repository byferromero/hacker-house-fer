'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'system' | 'question' | 'answer' | 'error' | 'loading';
  text: string;
}

interface Option {
  value: string;
  label: string;
}

interface Question {
  id: string;
  question: string;
  questionMobile?: string; // Versión corta para móvil
  placeholder?: string;
  validate?: (value: string) => string | null;
  options?: Option[]; // Opciones para mostrar como botones en móvil
  multiSelect?: boolean; // Si permite selección múltiple
}

// Hook para detectar móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
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
    questionMobile: '> ¿Cómo te describes?',
    placeholder: 'Ej: 1,2',
    options: [
      { value: '1', label: 'Vibe Coder' },
      { value: '2', label: 'Indie Hacker' },
      { value: '3', label: 'Developer' },
      { value: '4', label: 'Maker' },
      { value: '5', label: 'Otro' }
    ],
    multiSelect: true
  },
  {
    id: 'accommodation',
    question: '> ¿Necesitas alojamiento?\n  [1] Sí, necesito alojamiento\n  [2] No, tengo alojamiento\n> Elige 1 o 2:',
    questionMobile: '> ¿Necesitas alojamiento?',
    placeholder: '1 o 2',
    validate: (v) => !['1', '2'].includes(v.trim()) ? 'Responde 1 o 2' : null,
    options: [
      { value: '1', label: 'Sí, necesito' },
      { value: '2', label: 'No, tengo' }
    ]
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
    question: '> ¿Qué días puedes venir?\n  [1] Sábado 18\n  [2] Domingo 19\n  [3] Lunes 20\n  [4] Martes 21\n  [5] Miércoles 22\n> Números separados por comas:',
    questionMobile: '> ¿Qué días puedes venir?',
    placeholder: 'Ej: 1,2,3,4,5',
    options: [
      { value: '1', label: 'Sáb 18' },
      { value: '2', label: 'Dom 19' },
      { value: '3', label: 'Lun 20' },
      { value: '4', label: 'Mar 21' },
      { value: '5', label: 'Mié 22' }
    ],
    multiSelect: true
  },
  {
    id: 'loom',
    question: '> Graba un Loom (<2 min) explicando por qué deberíamos elegirte.\n> Comparte el link de tu video:',
    questionMobile: '> Link de tu Loom (<2 min):',
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
  const [isFormCompleted, setIsFormCompleted] = useState(false); // Evita reenvío del formulario
  const [isBootComplete, setIsBootComplete] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasBooted = useRef(false);
  const isMobile = useIsMobile();

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when not typing, boot complete, and auto-scroll on mobile
  useEffect(() => {
    if (isBootComplete && !isTyping && !isSubmitting && currentQuestion < questions.length) {
      inputRef.current?.focus();
      // Auto-scroll al input en móvil para que siempre sea visible
      if (isMobile) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [isTyping, isBootComplete, isSubmitting, currentQuestion, isMobile]);

  // Reset selected options when question changes
  useEffect(() => {
    setSelectedOptions([]);
  }, [currentQuestion]);

  // Listener global de ESC para cerrar el terminal en cualquier momento
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Initialize terminal with boot sequence (only once)
  useEffect(() => {
    if (!hasBooted.current) {
      hasBooted.current = true;
      bootSequence();
    }
  }, []);

  const bootSequence = async () => {
    // Delays más cortos en móvil para llegar rápido a las preguntas
    const d = (ms: number) => isMobile ? Math.floor(ms / 2) : ms;

    // Boot messages
    await addLine({ type: 'system', text: '> Inicializando sistema de registro...' }, d(300));
    await addLine({ type: 'loading', text: '> ' }, d(800)); // Loading dots
    await removeLine(); // Remove loading
    await addLine({ type: 'system', text: '> ✓ Conexión establecida' }, d(200));
    await addLine({ type: 'system', text: '> Hacker House Registration System v2.0' }, d(400));
    await addLine({ type: 'system', text: '> ' }, d(100));
    const instructionText = isMobile
      ? '> Responde las preguntas. Toca ENVIAR para continuar.'
      : '> Responde las siguientes preguntas. Presiona ENTER para enviar cada respuesta.';
    await addLine({ type: 'system', text: instructionText }, d(600));
    await addLine({ type: 'system', text: '> ' }, d(200));
    await addLine({ type: 'error', text: '⚠️  AVISO: Te pediremos un video corto (<2 min) al final.' }, d(400));
    await addLine({ type: 'error', text: '   Prepáralo con antelación → grábalo en loom.com' }, d(300));
    await addLine({ type: 'system', text: '> ' }, d(300));

    // Show first question with typing effect
    const questionText = isMobile && questions[0].questionMobile
      ? questions[0].questionMobile
      : questions[0].question;
    await showQuestionWithTyping(questionText);

    // Boot sequence completo, ahora mostrar input
    setIsBootComplete(true);
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
    // Typing más rápido en móvil (10ms vs 30ms)
    const typingSpeed = isMobile ? 10 : 30;

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
          await new Promise(resolve => setTimeout(resolve, typingSpeed));
        }
      }
    }

    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTyping || isFormCompleted) return;

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
      const d = (ms: number) => isMobile ? Math.floor(ms / 2) : ms;
      await addLine({ type: 'system', text: '>' }, d(200));

      // Show loading while "thinking"
      await addLine({ type: 'loading', text: '> ' }, d(400));
      await removeLine(); // Remove loading

      setCurrentQuestion(prev => prev + 1);
      const nextQ = questions[currentQuestion + 1];
      const questionText = isMobile && nextQ.questionMobile
        ? nextQ.questionMobile
        : nextQ.question;
      await showQuestionWithTyping(questionText);
    } else {
      // Finished - send data
      await submitForm({ ...newAnswers, [currentQ.id]: trimmedInput });
    }
  };

  // Handler para selección de opciones táctiles
  const handleOptionSelect = (value: string) => {
    const currentQ = questions[currentQuestion];
    if (currentQ.multiSelect) {
      setSelectedOptions(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setSelectedOptions([value]);
    }
  };

  // Enviar selección de opciones
  const handleOptionsSubmit = async () => {
    if (selectedOptions.length === 0) return;

    const currentQ = questions[currentQuestion];
    const answer = selectedOptions.sort().join(',');

    // Save answer
    const newAnswers = { ...answers, [currentQ.id]: answer };
    setAnswers(newAnswers);

    // Mostrar respuesta con labels
    const labels = selectedOptions
      .map(v => currentQ.options?.find(o => o.value === v)?.label)
      .filter(Boolean)
      .join(', ');
    await addLine({ type: 'answer', text: `> ${labels}` }, 0);
    setSelectedOptions([]);

    // Next question or finish
    if (currentQuestion < questions.length - 1) {
      const d = (ms: number) => isMobile ? Math.floor(ms / 2) : ms;
      await addLine({ type: 'system', text: '>' }, d(200));
      await addLine({ type: 'loading', text: '> ' }, d(400));
      await removeLine();

      setCurrentQuestion(prev => prev + 1);
      const nextQ = questions[currentQuestion + 1];
      const questionText = isMobile && nextQ.questionMobile
        ? nextQ.questionMobile
        : nextQ.question;
      await showQuestionWithTyping(questionText);
    } else {
      await submitForm(newAnswers);
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

      // Marcar formulario como completado para evitar reenvíos
      setIsFormCompleted(true);

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

  // Verificar si la pregunta actual tiene opciones (para mostrar botones en móvil)
  const currentQ = questions[currentQuestion];
  // Solo mostrar controles cuando: boot completo, no typing, no submitting, hay preguntas pendientes
  const canShowInput = isBootComplete && !isTyping && !isSubmitting && !isFormCompleted && currentQuestion < questions.length;
  const showOptionButtons = isMobile && currentQ?.options && canShowInput;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[100dvh] sm:h-[80vh] bg-black border-2 flex flex-col terminal-container" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 50px rgba(134, 239, 172, 0.3)' }}>
        {/* Terminal Header - más compacto en móvil */}
        <div className="border-b-2 px-2 py-1 sm:px-4 sm:py-2 flex items-center justify-between" style={{ backgroundColor: 'var(--dark-gray)', borderColor: 'var(--neon-green)' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors hover:shadow-[0_0_8px_rgba(239,68,68,0.7)] cursor-pointer flex items-center justify-center group"
              aria-label="Cerrar terminal"
            >
              <span className="text-[6px] sm:text-[8px] font-bold text-red-900 opacity-0 group-hover:opacity-100 transition-opacity leading-none">✕</span>
            </button>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: 'var(--neon-green)' }}></div>
            <span className="ml-2 sm:ml-4 text-xs sm:text-sm font-mono" style={{ color: 'var(--neon-green)' }}>
              <span className="hidden sm:inline">terminal@hackerhouse:~/register</span>
              <span className="sm:hidden">register</span>
            </span>
          </div>
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

          {/* Option Buttons para móvil */}
          {showOptionButtons && (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {currentQ.options?.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className={`px-3 py-2 font-mono text-sm border-2 rounded transition-all min-h-[44px] ${
                      selectedOptions.includes(option.value)
                        ? 'bg-[var(--neon-green)] text-black border-[var(--neon-green)]'
                        : 'bg-transparent border-[var(--neon-green)] text-[var(--neon-green)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleOptionsSubmit}
                  className="w-full py-3 font-mono text-sm border-2 rounded bg-[var(--neon-green)] text-black border-[var(--neon-green)] font-bold min-h-[48px]"
                >
                  ENVIAR →
                </button>
              )}
              {currentQ.multiSelect && (
                <p className="text-xs font-mono" style={{ color: 'var(--neon-blue)' }}>
                  Puedes seleccionar varios
                </p>
              )}
            </div>
          )}

          {/* Input Line - oculto durante boot, typing, y cuando hay option buttons */}
          {canShowInput && !showOptionButtons && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 py-2 sm:py-0">
              <span style={{ color: 'var(--neon-green)' }}>&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={questions[currentQuestion]?.placeholder}
                className="flex-1 bg-transparent outline-none font-mono placeholder:opacity-30 text-base sm:text-sm min-h-[44px] sm:min-h-0"
                style={{ color: 'var(--foreground)' }}
                autoComplete="off"
              />
              <span className="animate-pulse" style={{ color: 'var(--neon-green)' }}>▋</span>
            </form>
          )}

          {/* Botón enviar visible en móvil para inputs de texto */}
          {isMobile && canShowInput && !showOptionButtons && (
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              className="mt-2 w-full py-3 font-mono text-sm border-2 rounded bg-[var(--neon-green)] text-black border-[var(--neon-green)] font-bold min-h-[48px]"
            >
              ENVIAR →
            </button>
          )}
        </div>

        {/* Terminal Footer - más compacto en móvil */}
        <div className="border-t-2 px-2 py-1 sm:px-4 sm:py-2 text-xs font-mono" style={{ backgroundColor: 'var(--dark-gray)', borderColor: 'var(--neon-green)', color: 'var(--neon-blue)' }}>
          <div className="flex justify-between">
            <span>{Math.min(currentQuestion + 1, questions.length)}/{questions.length}</span>
            <span className="hidden sm:inline">ESC para salir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
