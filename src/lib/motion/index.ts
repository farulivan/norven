// Public surface of the motion runtime. Importing this boots the runtime
// (registers the gsap plugin, binds the view-transition lifecycle), so
// BaseLayout imports it once and effect modules import { scrollEffect } from here.
export { scrollEffect } from "./runtime";
export { reducedMotion, EASE } from "./reduced";
