// Real Claude API integration for the AI Content Studio.
// The user pastes their own Anthropic API key (stored only in their browser's
// localStorage — it never touches a server, since GrowGram is fully static).
// Without a key the Studio falls back to the built-in offline engine in aiStudio.js.

import Anthropic from '@anthropic-ai/sdk'

const KEY_STORAGE = 'growgram.anthropic.key'

export const getClaudeKey = () => localStorage.getItem(KEY_STORAGE) || ''
export const setClaudeKey = (key) => {
  if (key) localStorage.setItem(KEY_STORAGE, key.trim())
  else localStorage.removeItem(KEY_STORAGE)
}
export const hasClaudeKey = () => !!getClaudeKey()

const SCHEMA = {
  type: 'object',
  properties: {
    caption: { type: 'string', description: 'An engaging Instagram caption with a hook, body and call-to-action. Use line breaks and a few emoji.' },
    hashtags: { type: 'array', items: { type: 'string' }, description: '12-15 hashtags, each starting with #, mixing large and niche tags.' },
    tip: { type: 'string', description: 'One sharp, specific growth tip tailored to this post topic.' },
  },
  required: ['caption', 'hashtags', 'tip'],
  additionalProperties: false,
}

export async function generateWithClaude(topic) {
  const client = new Anthropic({ apiKey: getClaudeKey(), dangerouslyAllowBrowser: true })
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system:
      'You are the AI growth co-pilot inside GrowGram, an Instagram growth panel. ' +
      'Write scroll-stopping, authentic captions — never generic filler. Match the tone to the topic.',
    messages: [{ role: 'user', content: `Create Instagram post content about: ${topic}` }],
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
  })
  if (response.stop_reason === 'refusal') throw new Error('Claude declined this topic — try rephrasing.')
  const text = response.content.find((b) => b.type === 'text')?.text
  return JSON.parse(text)
}
