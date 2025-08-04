<template>
  <div class="error">
    <div class="content">
      <h1>Error 404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button @click="$router.push('/home')">Go back home</button>
    </div>
  </div>
</template>

<style scoped>
.error {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5d3d2e;
  text-align: center;
  padding: 2rem;
}

.content h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.content p {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.content button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #5d3d2e;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.content button:hover {
  background-color: #4b2f23;
}
</style>
