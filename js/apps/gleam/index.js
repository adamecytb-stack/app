/* Gleam's routes and the chrome shared by its four tabs. */

import { el, icon } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { g, rollDay, goalMet } from './state.js';
import { onboardingScreen } from './onboarding.js';
import { learnScreen } from './learn.js';
import { lessonScreen } from './lesson.js';
import { practiceScreen, practiceRunScreen } from './practice.js';
import { leagueScreen } from './league.js';
import { profileScreen } from './profile.js';

const TABS = [
  { id: 'learn', label: 'Learn', icon: 'book', path: '/gleam/learn' },
  { id: 'practice', label: 'Practice', icon: 'chat', path: '/gleam/practice' },
  { id: 'league', label: 'League', icon: 'crown', path: '/gleam/league' },
  { id: 'profile', label: 'You', icon: 'user', path: '/gleam/profile' },
];

export function tabbar(active) {
  return el('nav', { class: 'tabbar' }, TABS.map((t) => el('a', {
    class: 'tab',
    href: `#${t.path}`,
    'aria-current': t.id === active ? 'page' : null,
  }, [icon(t.icon), el('span', { text: t.label })])));
}

/** The sticky header with streak / XP / freezes, shared by every tab. */
export function statusBar({ back = null } = {}) {
  rollDay();
  const freezeStat = g.freezes > 0
    ? el('span', { class: 'gtop__stat gtop__stat--freeze' }, [icon('snow'), el('span', { class: 'num', text: String(g.freezes) })])
    : null;

  return el('header', { class: 'gtop' }, [
    back && el('a', { class: 'iconbtn gtop__back', href: `#${back}`, 'aria-label': 'Back' }, icon('chevronLeft')),
    el('span', {
      class: 'gtop__stat gtop__stat--streak',
      style: g.streak === 0 ? { opacity: '0.45' } : {},
    }, [icon('flame'), el('span', { class: 'num', text: String(g.streak) })]),
    el('span', { class: 'gtop__stat gtop__stat--xp' }, [icon('bolt'), el('span', { class: 'num', text: String(g.xp) })]),
    freezeStat,
    el('span', { class: 'gtop__spacer' }),
    goalMet() && el('span', { class: 'chip chip--accent' }, [icon('check', 15), 'Goal met']),
  ]);
}

/** Wraps a tab's content with the header, scroller and tab bar. */
export function tabScreen(id, content, { header = true } = {}) {
  return el('div', { class: 'screen screen--flush screen--tabbed' }, [
    header && statusBar(),
    el('div', { class: 'stack', style: { padding: '0 0 8px' } }, content),
    tabbar(id),
  ]);
}

function requireOnboarding() {
  if (!g.onboarded) { router.go('/gleam/welcome', { replace: true }); return false; }
  return true;
}

export function registerGleam() {
  router.route('/gleam', () => {
    router.go(g.onboarded ? '/gleam/learn' : '/gleam/welcome', { replace: true });
    return false;
  });

  router.route('/gleam/welcome', () => {
    if (g.onboarded) { router.go('/gleam/learn', { replace: true }); return false; }
    return onboardingScreen();
  });

  router.route('/gleam/learn', () => (requireOnboarding() ? learnScreen() : false));
  router.route('/gleam/practice', () => (requireOnboarding() ? practiceScreen() : false));
  router.route('/gleam/practice/:id', (p) => (requireOnboarding() ? practiceRunScreen(p.id) : false));
  router.route('/gleam/league', () => (requireOnboarding() ? leagueScreen() : false));
  router.route('/gleam/profile', () => (requireOnboarding() ? profileScreen() : false));
  router.route('/gleam/lesson/:id', (p) => (requireOnboarding() ? lessonScreen(p.id) : false));
}
