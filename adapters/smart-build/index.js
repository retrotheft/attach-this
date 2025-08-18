import adapterAuto from '@sveltejs/adapter-auto';
import { execSync } from 'child_process';

export default function smartBuild() {
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const isNetlify = process.env.NETLIFY;

  // Deploy environments: site only
  // Local/CI: library (or both)
  const buildLibrary = !isVercel && !isNetlify;

  return {
    name: 'smart-build',
    async adapt(builder) {
      if (buildLibrary) {
        console.log('Building library...');
        execSync('svelte-package', { stdio: 'inherit' });
      }

      // Always build site
      console.log('Building site...');
      await adapterAuto().adapt(builder);
    }
  };
}
