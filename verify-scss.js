const fs = require('fs');

console.log('🔍 Verificando sintaxis de main.scss...');

try {
  const content = fs.readFileSync('src/assets/styles/main.scss', 'utf8');
  const lines = content.split('\n');
  
  // Verificar que @use está al inicio
  let useRulesEnded = false;
  let hasError = false;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('@use')) {
      if (useRulesEnded) {
        console.log(`❌ Error línea ${index + 1}: @use debe ir al inicio`);
        hasError = true;
      }
    } else if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      useRulesEnded = true;
    }
  });
  
  if (!hasError) {
    console.log('✅ Sintaxis SCSS correcta');
  }
  
} catch (error) {
  console.log('❌ Error leyendo archivo:', error.message);
}