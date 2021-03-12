import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { getOrCreateProject } from "./scrap.ts";

const rmrf = (path: string) => {
  try {
    const stat = Deno.lstatSync(path);
    if (stat.isDirectory) {
      for (const e of Array.from(Deno.readDirSync(path)).sort()) {
        rmrf(`${path}/${e.name}`);
      }
    }
    Deno.removeSync(path);
  } catch (e) {
    return;
  }
};

// generate test data
const testDir = Deno.makeTempDirSync();
Deno.writeTextFileSync(`${testDir}/a.scp`, "[b]");
await new Promise((resolve) => setTimeout(resolve, 100)); // wait a little to make a difference of mtime
Deno.writeTextFileSync(`${testDir}/c.scp`, "[b]");

try {
  // 存在しないプロジェクトやファイルを読んでもエラーを起こさない
  const nonExistProject = getOrCreateProject(`${testDir}/nonexist`);
  nonExistProject.readAll();
  nonExistProject.resolve("hoge");

  const project = getOrCreateProject(testDir);
  project.readAll();
  const a = project.getOrCreatePage("a");
  const b = project.getOrCreatePage("b");
  const c = project.getOrCreatePage("c");

  // resolve link
  console.log("# resolve links");

  console.log("a -> b");
  assertEquals(Array.from(a.links.keys()).sort(), ["b"]);
  console.log("b <- a, c");
  assertEquals(Array.from(b.fromLinks.keys()).sort(), ["a", "c"]);
  console.log("c -> b");
  assertEquals(Array.from(c.links.keys()).sort(), ["b"]);

  // get links, backlinks, and two hop links
  console.log("# get links");

  console.log("a");
  console.log("links -> b | b -> c");
  const aLinks = a.getLinks();
  assertEquals(aLinks.length, 2); // links, b
  assertEquals(aLinks[0].relate, "links");
  assertEquals(aLinks[0].pages.map((p) => p.name), ["b"]);
  assertEquals(aLinks[1].relate, "b");
  assertEquals(aLinks[1].pages.map((p) => p.name), ["c"]); // ignore self
  console.log("b");
  console.log("fromLinks -> c, a");
  const bLinks = b.getLinks();
  assertEquals(bLinks.length, 1); // fromLinks
  assertEquals(bLinks[0].relate, "fromLinks");
  assertEquals(bLinks[0].pages.map((p) => p.name), ["c", "a"]);
  console.log("c");
  console.log("links -> b | b -> a");
  const cLinks = c.getLinks();
  assertEquals(cLinks.length, 2); // links, b
  assertEquals(cLinks[0].relate, "links");
  assertEquals(cLinks[0].pages.map((p) => p.name), ["b"]);
  assertEquals(cLinks[1].relate, "b");
  assertEquals(cLinks[1].pages.map((p) => p.name), ["a"]); // ignore self
} finally {
  rmrf(testDir);
}
