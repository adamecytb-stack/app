/* Course registry.
 *
 * Exercise item shapes used across every course:
 *
 *   { t:'concept',  title, body, example?:{label,line}, tip? }
 *   { t:'choice',   prompt, context?, options:[{text, ok?, why}] }
 *   { t:'multi',    prompt, context?, options:[{text, ok?}], why }
 *   { t:'tf',       prompt, statement, answer:Boolean, why }
 *   { t:'order',    prompt, items:[...] }            // listed in correct order
 *   { t:'blank',    prompt, sentence:'.. ___ ..', bank:[...], answer }
 *   { t:'match',    prompt, pairs:[[left,right],..] }
 *   { t:'freeform', prompt, context?, rubric:{want:[],avoid:[],minWords,sample} }
 */

import talkingToThem from './courses/talking-to-them.js';
import texting from './courses/texting.js';
import signals from './courses/signals.js';
import makingAMove from './courses/making-a-move.js';
import nerves from './courses/nerves.js';
import school from './courses/school.js';
import parties from './courses/parties.js';
import likeable from './courses/likeable.js';

export const COURSES = [
  talkingToThem,
  texting,
  signals,
  makingAMove,
  nerves,
  school,
  parties,
  likeable,
];

// Stamp back-references so a lesson always knows its course.
COURSES.forEach((course, ci) => {
  course.index = ci;
  course.lessons.forEach((lesson, li) => {
    lesson.courseId = course.id;
    lesson.index = li;
    lesson.xp = lesson.xp ?? 20;
    lesson.minutes = lesson.minutes ?? Math.max(3, Math.round(lesson.items.length * 0.7));
  });
});

const BY_ID = new Map();
for (const course of COURSES) for (const lesson of course.lessons) BY_ID.set(lesson.id, lesson);

export function lessonById(id) { return BY_ID.get(id) || null; }
export function courseById(id) { return COURSES.find((c) => c.id === id) || null; }
export function allLessons() { return [...BY_ID.values()]; }
