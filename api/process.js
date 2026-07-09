export default async function handler(req, res) {
  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'El texto no puede estar vacío' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: `Eres un asistente ejecutivo de élite y un experto en productividad (método GTD - Getting Things Done). Tu trabajo es procesar "volcados mentales" caóticos y desestructurados del usuario y convertirlos en información perfectamente categorizada y accionable.

El usuario te va a pasar un texto largo, desordenado, lleno de ideas sueltas, tareas pendientes, emociones, citas y eventos. No juzgues el caos.

Analiza el texto y clasifica la información en las siguientes categorías. Si no hay información para una categoría, omítela completamente. No añadas introducción, cierre ni explicaciones fuera del formato.

Responde ÚNICAMENTE con este formato Markdown:

🚨 URGENTE Y PRIORITARIO (Para hoy):
* [Tareas que el usuario indica que deben hacerse ya. Usa verbos de acción claros]

✅ TAREAS PENDIENTES (To-Do List):
* [Acciones claras. En vez de "el coche" escribe "Llamar al taller para revisar el coche"]

📅 CALENDARIO Y CITAS:
* [Eventos con fecha o momento específico. Ej: "Reunión con Marta el jueves a las 17:00"]

🛒 LISTA DE LA COMPRA / RECADOS:
* [Cosas físicas a comprar o lugares a los que ir, agrupadas lógicamente]

📝 NOTAS, IDEAS Y REFLEXIONES (Para archivar):
* [Pensamientos a largo plazo, ideas de proyectos, sin acción inmediata. Como resumen para Notion/Obsidian]

🗑️ RUIDO MENTAL (Descartado):
* [Frase empática sobre las frustraciones mencionadas solo para desahogarse]`,
        messages: [{ role: 'user', content: text.trim() }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Anthropic error:', err);
      return res.status(response.status).json({
        error: err?.error?.message || 'Error al contactar con Claude',
      });
    }

    const data = await response.json();
    const result = data?.content?.[0]?.text || '';

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
