import { consultoria, educa, allKeywords } from "../src/data/keywords";
import { courses } from "../src/data/courses";
const dup = allKeywords.map((k) => `${k.unit}|${k.keyword.toLowerCase()}`).filter((v, i, a) => a.indexOf(v) !== i);
const slugs = courses.map((c) => c.slug);
console.log({ consultoria: consultoria.length, educa: educa.length, duplicados: dup, cursos: courses.length, slugsUnicos: new Set(slugs).size, aulas: courses.reduce((n, c) => n + c.modules.reduce((m, x) => m + x.lessons.length, 0), 0) });
if (consultoria.length !== 50 || educa.length !== 50 || dup.length || courses.length !== 10 || new Set(slugs).size !== 10) process.exit(1);
