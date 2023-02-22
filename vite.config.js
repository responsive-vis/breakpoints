import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dsv from '@rollup/plugin-dsv';
// import json from '@rollup/plugin-json';

export default defineConfig({
	plugins: [sveltekit(), dsv()] //, json()
});
