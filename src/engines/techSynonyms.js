export const TECH_SYNONYMS = {
  node: ['node', 'nodejs', 'node.js', 'express', 'nestjs', 'fastify', 'nest.js'],
  react: ['react', 'reactjs', 'react.js', 'next.js', 'nextjs', 'next'],
  typescript: ['typescript', 'ts'],
  javascript: ['javascript', 'js', 'ecmascript'],
  python: ['python', 'django', 'flask', 'fastapi', 'pandas'],
  php: ['php', 'laravel', 'symfony', 'wordpress'],
  wordpress: ['wordpress', 'wp', 'woocommerce'],
  java: ['java', 'spring', 'springboot', 'kotlin'],
  dotnet: ['.net', 'dotnet', 'c#', 'csharp', 'asp.net'],
  vue: ['vue', 'vuejs', 'vue.js', 'nuxt', 'nuxtjs'],
  angular: ['angular', 'angularjs'],
  go: ['golang', 'go'],
  rust: ['rust'],
  ruby: ['ruby', 'rails', 'ruby on rails'],
  mobile: ['react native', 'flutter', 'swift', 'kotlin android', 'ios'],
};

export function getSynonyms(tech) {
  const key = tech.toLowerCase().trim();
  return TECH_SYNONYMS[key] || [key];
}

export function getAllCanonicalTechs() {
  return Object.keys(TECH_SYNONYMS);
}
