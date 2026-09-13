/* The weekly league.
 *
 * There is no server, so the rivals are simulated — a deterministic roster
 * seeded from the ISO week, with XP curves that tick forward in real time.
 * Fake competition, real motivation. The Profile screen says so plainly. */

import { el, icon } from '../../core/ui.js';
import { ensureLeague, leagueBoard, leagueEndsIn, TIERS } from './state.js';
import { tabScreen } from './index.js';

const PROMOTE = 3;
const DEMOTE = 3;

function rankCell(rank) {
  if (rank <= 3) {
    const medal = icon('medal', 21);
    medal.style.color = ['#F5C542', '#C8CBD4', '#C98A5A'][rank - 1];
    return el('span', { class: 'brow__rank' }, medal);
  }
  return el('span', { class: 'brow__rank num', text: String(rank) });
}

export function leagueScreen() {
  const league = ensureLeague();
  const tier = TIERS[league.tier];
  const rows = leagueBoard(league);
  const yourRank = rows.findIndex((r) => r.you) + 1;

  const board = el('div', { class: 'board' });
  rows.forEach((row, i) => {
    const rank = i + 1;
    if (rank === PROMOTE + 1) board.append(el('div', { class: 'zoneline', text: 'Promotion zone above' }));
    if (rank === rows.length - DEMOTE + 1) board.append(el('div', { class: 'zoneline', text: 'Demotion zone below' }));

    board.append(el('div', {
      class: `brow${row.you ? ' brow--you' : ''}${rank <= PROMOTE ? ' brow--promo' : ''}${rank > rows.length - DEMOTE ? ' brow--demo' : ''}`,
    }, [
      rankCell(rank),
      el('span', { class: 'brow__name', text: row.name }),
      el('span', { class: 'brow__xp num', text: `${row.xp.toLocaleString()} XP` }),
    ]));
  });

  const standing = yourRank <= PROMOTE
    ? `Holding a promotion spot. ${TIERS[Math.min(TIERS.length - 1, league.tier + 1)].name} is one week away.`
    : yourRank > rows.length - DEMOTE
      ? `In the drop zone. ${rows[rows.length - DEMOTE - 1].xp - rows[yourRank - 1].xp} XP would pull you clear.`
      : `${rows[PROMOTE - 1].xp - rows[yourRank - 1].xp} XP off the promotion zone.`;

  return tabScreen('league', [
    el('div', { class: 'stack', style: { padding: '0 var(--gutter)' } }, [
      el('div', { class: 'tierhead' }, [
        el('div', { class: 'tierhead__badge', style: { color: tier.color } }, icon('crown', 46)),
        el('div', { class: 'tierhead__name', text: `${tier.name} League` }),
        el('div', { class: 'tierhead__sub', text: `Top ${PROMOTE} promote · bottom ${DEMOTE} drop · resets in ${leagueEndsIn()}` }),
      ]),

      el('div', { class: 'card', style: { marginBottom: '18px' } }, [
        el('div', { class: 'row gap-12' }, [
          el('div', { class: 'grow' }, [
            el('div', { class: 'eyebrow', text: `Rank ${yourRank} of ${rows.length}` }),
            el('p', { class: 'small', style: { marginTop: '4px' }, text: standing }),
          ]),
          el('div', { class: 'center' }, [
            el('div', { class: 'display display--sm num', style: { color: 'var(--ember)' }, text: String(league.selfXp) }),
            el('div', { class: 'small', text: 'XP this week' }),
          ]),
        ]),
      ]),

      board,

      el('p', {
        class: 'small center',
        style: { marginTop: '18px' },
        text: 'Your rivals are simulated — this app has no server and no other players. The pressure still works.',
      }),
    ]),
  ]);
}
