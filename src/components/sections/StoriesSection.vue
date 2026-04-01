<template>
  <section class="stories-section" id="stories">
    <FadeInUp>
      <h2 class="section-title">{{ $t('stories.title') }}</h2>
    </FadeInUp>

    <div class="chat-container">
      <div 
        v-for="(dialogue, index) in dialogues" 
        :key="index"
        class="message-wrapper"
        :class="{ 'is-user': dialogue.avatar === 'user' }"
      >
        <FadeInUp :delay="index * 150">
          <div class="message">
            <div class="avatar" :class="dialogue.avatar">
              <img 
                v-if="dialogue.avatar === 'character'" 
                src="/sakuryne260401.webp" 
                alt="Sakuryne"
                class="avatar-img"
              />
              <icon-lucide-user v-else class="avatar-icon" />
            </div>
            
            <div class="message-content">
              <div class="message-header">
                <span class="speaker-name">{{ dialogue.speaker }}</span>
                <span class="message-time">{{ dialogue.time }}</span>
              </div>
              <div class="message-bubble" :class="dialogue.avatar">
                <TypeWriter 
                  :text="dialogue.text" 
                  :speed="40"
                  :delay="index * 150 + 300"
                  :showCursor="false"
                />
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FadeInUp from '@/components/ui/FadeInUp.vue'
import TypeWriter from '@/components/ui/TypeWriter.vue'

const { t } = useI18n()

const dialogues = computed(() => {
  const count = 6
  return Array.from({ length: count }, (_, i) => ({
    speaker: t(`stories.dialogues.${i}.speaker`),
    avatar: t(`stories.dialogues.${i}.avatar`),
    text: t(`stories.dialogues.${i}.text`),
    time: t(`stories.dialogues.${i}.time`)
  }))
})
</script>

<style scoped>
.stories-section {
  min-height: 100vh;
  padding: 6rem 1.5rem;
  background: linear-gradient(180deg, var(--background) 0%, var(--primary-bg) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--foreground);
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 2px;
}

.chat-container {
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
}

.message-wrapper.is-user {
  justify-content: flex-end;
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 85%;
  align-items: flex-start;
}

.message-wrapper.is-user .message {
  flex-direction: row-reverse;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar.character {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  padding: 2px;
  animation: avatar-bounce 2s ease-in-out infinite;
}

.avatar.user {
  background-color: var(--muted-bg);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--background);
}

.avatar-icon {
  width: 24px;
  height: 24px;
  color: var(--muted);
}

@keyframes avatar-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.message-wrapper.is-user .message-content {
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.message-wrapper.is-user .message-header {
  flex-direction: row-reverse;
}

.speaker-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
}

.message-time {
  font-size: 0.75rem;
  color: var(--muted);
  font-family: monospace;
}

.message-bubble {
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  font-size: 0.95rem;
  line-height: 1.6;
  position: relative;
  word-break: break-word;
}

.message-bubble.character {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--foreground);
  border-top-left-radius: 0.25rem;
}

.message-bubble.user {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  border-top-right-radius: 0.25rem;
}

@media (max-width: 768px) {
  .stories-section {
    padding: 4rem 1rem;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .chat-container {
    gap: 1rem;
  }

  .message {
    max-width: 90%;
    gap: 0.75rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .avatar-icon {
    width: 20px;
    height: 20px;
  }

  .message-bubble {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .message {
    max-width: 95%;
  }

  .speaker-name {
    font-size: 0.8rem;
  }

  .message-time {
    font-size: 0.7rem;
  }

  .message-bubble {
    padding: 0.75rem 0.875rem;
    font-size: 0.85rem;
  }
}
</style>
