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

import smallTalk from './courses/small-talk.js';
import conversationFlow from './courses/conversation-flow.js';
import charisma from './courses/charisma.js';
import storytelling from './courses/storytelling.js';
import dating from './courses/dating.js';
import readingPeople from './courses/reading-people.js';
import groups from './courses/groups.js';
import hardConversations from './courses/hard-conversations.js';

export const COURSES = [
  smallTalk,
  conversationFlow,
  charisma,
  storytelling,
  dating,
  readingPeople,
  groups,
  hardConversations,
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
