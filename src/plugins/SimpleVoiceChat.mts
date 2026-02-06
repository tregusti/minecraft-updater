import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from './utils/ModrinthPlugin.mts'

export const SimpleVoiceChat: UpdatePlugin = {
  title: 'SimpleVoiceChat',
  info: async () => getLatestRelease('SimpleVoiceChat', 'simple-voice-chat'),
}
