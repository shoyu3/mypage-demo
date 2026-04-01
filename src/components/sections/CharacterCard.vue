<template>
  <section class="character-section" id="character" :style="{ minHeight: viewportHeight + 'px' }">
    <GlowCard class="character-card">
      <div class="card-inner">
        <!-- 左侧：立绘区域 -->
        <div class="character-visual">
          <div class="character-avatar">
            <img src="/sakuryne260401.webp" alt="Sakuryne" class="avatar-img" />
            <div class="avatar-glow"></div>
          </div>
          <div class="floating-traits">
            <span 
              v-for="(trait, index) in traits" 
              :key="index"
              class="trait-tag"
              :style="{ animationDelay: `${index * 0.2}s` }"
            >
              {{ trait }}
            </span>
          </div>
        </div>

        <!-- 右侧：信息区域 -->
        <div class="character-info">
          <div class="name-section">
            <h2 class="character-name">{{ $t('character.name') }}</h2>
            <span class="character-subtitle">{{ $t('character.subtitle') }}</span>
          </div>

          <div class="basic-info">
            <div class="info-item">
              <span class="info-label">{{ $t('character.race') }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t('character.origin') }}</span>
            </div>
          </div>

          <div class="stats-section">
            <div v-for="(key, index) in statKeys" :key="key" class="stat-item">
              <div class="stat-header">
                <span class="stat-name">{{ $t(`character.stats.${key}`) }}</span>
                <CountUp 
                  :end="statValues[key]" 
                  suffix="%"
                  class="stat-value"
                />
              </div>
              <div class="stat-bar">
                <div 
                  class="stat-fill" 
                  :style="{ width: `${statValues[key]}%`, animationDelay: `${0.5 + index * 0.1}s` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="likes-section">
            <h3 class="section-label">{{ $t('character.catchphrase') }}</h3>
            <div class="likes-tags">
              <span v-for="(like, index) in likes" :key="index" class="like-tag">
                {{ like }}
              </span>
            </div>
          </div>

          <p class="character-desc">{{ $t('character.description') }}</p>
        </div>
      </div>
    </GlowCard>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GlowCard from '@/components/ui/GlowCard.vue'
import CountUp from '@/components/ui/CountUp.vue'

const props = defineProps({
  viewportHeight: {
    type: Number,
    default: window.innerHeight
  }
})

const { t, locale } = useI18n()

const traits = computed(() => t('character.traits').split(','))
const likes = computed(() => t('character.likes').split(','))

const statKeys = ['creativity', 'coding', 'nightOwl', 'bugCollection']
const statValues = {
  creativity: 95,
  coding: 88,
  nightOwl: 92,
  bugCollection: 100
}
</script>

<style scoped>
.character-section {
  padding: 6rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.character-card {
  max-width: 900px;
  width: 100%;
}

.card-inner {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

/* 左侧视觉区域 */
.character-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.character-avatar {
  position: relative;
  width: 250px;
  height: 250px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  position: relative;
  z-index: 2;
  border: 3px solid var(--glass-border);
}

.avatar-glow {
  position: absolute;
  inset: -10px;
  background: linear-gradient(135deg, var(--primary) 0%, transparent 50%, var(--primary-hover) 100%);
  border-radius: 1.25rem;
  opacity: 0.5;
  filter: blur(20px);
  animation: pulse-glow 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

.floating-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.trait-tag {
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--glass-bg) 100%);
  border: 1px solid var(--primary-border);
  border-radius: 9999px;
  font-size: 0.8rem;
  color: var(--primary);
  animation: float-trait 3s ease-in-out infinite;
}

@keyframes float-trait {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 右侧信息区域 */
.character-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.name-section {
  margin-bottom: 0.5rem;
}

.character-name {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.character-subtitle {
  font-size: 1rem;
  color: var(--muted);
  font-family: monospace;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  font-size: 0.9rem;
  color: var(--muted);
}

.info-label {
  position: relative;
  padding-left: 1rem;
}

.info-label::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--primary);
}

/* 属性条 */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  font-size: 0.875rem;
  color: var(--foreground);
  font-weight: 500;
}

.stat-value {
  font-size: 0.875rem;
  color: var(--primary);
  font-weight: 600;
  font-family: monospace;
}

.stat-bar {
  height: 6px;
  background-color: var(--muted-bg);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 100%);
  border-radius: 3px;
  width: 0;
  animation: fill-bar 1s ease-out forwards;
}

@keyframes fill-bar {
  from { width: 0; }
}

/* 喜好标签 */
.likes-section {
  margin-top: 0.5rem;
}

.section-label {
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.likes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.like-tag {
  padding: 0.5rem 1rem;
  background-color: var(--primary-bg);
  color: var(--primary);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.like-tag:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.character-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--muted);
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
}

/* 响应式 */
@media (max-width: 768px) {
  .character-section {
    padding: 4rem 1rem;
  }

  .card-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .character-avatar {
    width: 180px;
    height: 180px;
  }

  .character-name {
    font-size: 2rem;
    text-align: center;
  }

  .character-subtitle {
    display: block;
    text-align: center;
  }

  .basic-info {
    align-items: center;
  }

  .character-desc {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .character-avatar {
    width: 150px;
    height: 150px;
  }

  .character-name {
    font-size: 1.75rem;
  }

  .trait-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
  }

  .like-tag {
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
