import { getOrCreateProject } from "./scrap.ts";

if (Deno.args.length !== 2) {
  console.warn("引数間違ってるのでは？");
  Deno.exit(1);
}
const project = getOrCreateProject(Deno.args[0]);
project.readAll();
const page = project.getOrCreatePage(Deno.args[1]);
const links = page.getLinks();
for (const { relate, pages } of links) {
  console.log(`${relate}:`);
  for (const p of pages) {
    console.log(`\t${p.name}`);
  }
}
