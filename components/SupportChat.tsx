'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Bot, User, Heart, Lightbulb, Target } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const quickReplies = [
  "Tengo ganas de fumar",
  "¿Cómo manejo el estrés?",
  "Consejos para dormir mejor",
  "¿Cuánto tiempo dura la abstinencia?",
  "Motivación para continuar",
  "Ejercicios de respiración"
]

const motivationalQuotes = [
  "Cada día sin fumar es una victoria. ¡Tú puedes!",
  "Tu futuro yo te agradecerá por esta decisión.",
  "La fuerza está dentro de ti. ¡Mantén la calma!",
  "Un día a la vez. No te rindas.",
  "Eres más fuerte que cualquier antojo.",
  "Tu salud es tu mayor riqueza."
]

export default function SupportChat() {
  const { progress } = useProgress()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente personal para ayudarte a dejar de fumar marihuana. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = async (userMessage: string) => {
    setIsTyping(true)
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    let response = ''

    if (userMessage.toLowerCase().includes('ganas de fumar') || userMessage.toLowerCase().includes('antojo')) {
      response = `Entiendo que tienes ganas de fumar. Es normal sentir esto. Te sugiero:

1. **Respira profundamente** - Inhala por 4 segundos, mantén por 4, exhala por 4
2. **Bebe agua** - Mantente hidratado
3. **Distráete** - Haz algo que te guste
4. **Recuerda tu objetivo** - ¿Por qué decidiste dejar de fumar?

¿Cuánto tiempo llevas sin fumar? ${progress?.currentStreak ? `¡Veo que ya llevas ${progress.currentStreak} días! ¡Eso es increíble!` : ''}`
    } else if (userMessage.toLowerCase().includes('estrés')) {
      response = `El estrés es un trigger común. Aquí tienes algunas técnicas:

🧘 **Meditación**: 5-10 minutos de respiración consciente
🏃 **Ejercicio**: Una caminata rápida o estiramientos
🎵 **Música**: Escucha algo que te relaje
✍️ **Escribir**: Anota tus pensamientos
🛁 **Baño caliente**: Relaja los músculos

¿Cuál de estas opciones te gustaría probar?`
    } else if (userMessage.toLowerCase().includes('dormir')) {
      response = `Los problemas de sueño son normales al dejar de fumar. Prueba:

🌙 **Rutina nocturna**: Acuéstate a la misma hora
📱 **Sin pantallas**: 1 hora antes de dormir
☕ **Sin cafeína**: Después de las 2 PM
🏃 **Ejercicio**: Pero no muy tarde
🛏️ **Ambiente**: Habitación fresca y oscura
📖 **Lectura**: Algo ligero antes de dormir

¿Has notado mejoras en tu sueño desde que dejaste de fumar?`
    } else if (userMessage.toLowerCase().includes('abstinencia') || userMessage.toLowerCase().includes('síntomas')) {
      response = `Los síntomas de abstinencia suelen durar 1-2 semanas, pero varían:

**Primera semana**: Irritabilidad, ansiedad, problemas de sueño
**Segunda semana**: Los síntomas empiezan a disminuir
**Después de 2-4 semanas**: La mayoría de síntomas desaparecen

Recuerda: estos síntomas son temporales y significan que tu cuerpo se está curando. ¡Mantén la calma!`
    } else if (userMessage.toLowerCase().includes('motivación') || userMessage.toLowerCase().includes('continuar')) {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      response = `${randomQuote}

También piensa en:
💪 **Tu salud**: Pulmones más limpios, mejor memoria
💰 **Tu dinero**: Ahorrarás dinero
🎯 **Tu tiempo**: Más tiempo para lo que realmente importa
👥 **Tus relaciones**: Mejor conexión con otros
🌟 **Tu futuro**: Una vida más saludable

¿Cuál es tu razón más importante para dejar de fumar?`
    } else if (userMessage.toLowerCase().includes('respiración')) {
      response = `¡Excelente elección! La respiración es una herramienta poderosa:

**Técnica 4-7-8**:
1. Inhala por la nariz por 4 segundos
2. Mantén la respiración por 7 segundos
3. Exhala por la boca por 8 segundos
4. Repite 4 veces

**Respiración cuadrada**:
1. Inhala por 4 segundos
2. Mantén por 4 segundos
3. Exhala por 4 segundos
4. Mantén vacío por 4 segundos

Práctica esto cuando sientas ansiedad o ganas de fumar.`
    } else {
      response = `Gracias por tu mensaje. Como tu asistente personal, estoy aquí para ayudarte en tu camino hacia una vida libre de marihuana.

¿Te gustaría que te ayude con:
- Manejo de antojos
- Técnicas de relajación
- Consejos para dormir mejor
- Motivación y apoyo
- Información sobre abstinencia

O siéntete libre de contarme cómo te sientes hoy.`
    }

    return response
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    const botResponse = await generateBotResponse(inputText)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleQuickReply = (reply: string) => {
    setInputText(reply)
  }

  return (
    <div className="space-y-6">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile bg-gradient-to-r from-primary-500 to-primary-600 text-white"
      >
        <div className="flex items-center">
          <Bot className="w-8 h-8 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Asistente Personal</h3>
            <p className="text-primary-100 text-sm">Aquí para ayudarte 24/7</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Replies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile"
      >
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-warning-600" />
          Preguntas Rápidas
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              {reply}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-mobile"
      >
        <div className="h-96 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start">
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mr-2 mt-0.5 text-primary-600" />
                  )}
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex items-center">
                  <Bot className="w-4 h-4 mr-2 text-primary-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-mobile"
      >
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
