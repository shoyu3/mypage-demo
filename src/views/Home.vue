<template>
  <div class="home">
    <div class="card">
      <h1>{{ $t('home.title') }}</h1>
      <p>{{ $t('home.description') }}</p>
    </div>
    <div class="icon-card">
      <icon-lucide-sparkles class="icon" />
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  padding: 1.5rem;
}

.card {
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.card h1 {
  color: var(--foreground);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card p {
  color: var(--muted);
  font-size: 1.125rem;
  line-height: 1.6;
}

.icon-card {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 1.5rem;
  color: var(--foreground);
}
</style>