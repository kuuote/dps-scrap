import { ensureString, main } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import { getOrCreateProject } from "./scrap.ts";
import { byteIndexToChar, getLink } from "./util.ts";

// Start plugin event-loop
main(async ({vim}) => {
  // Register dispatcher
  vim.register({
    async jump(line: unknown, col: unknown): Promise<void> {
      if (typeof line !== "string") {
        throw new Error();
      }
      if (typeof col !== "number") {
        throw new Error();
      }
      const charIndex = byteIndexToChar(line, col - 1);
      const result = getLink(line, charIndex);
      if (result === "") {
        return;
      }
      await vim.cmd(`edit %:h/${result}.scp`);
    },
    async updateLinks(bufnr: unknown, projectPath: unknown, pageName: unknown) {
      if (typeof bufnr !== "number") {
        throw new Error();
      }
      if (typeof projectPath !== "string") {
        throw new Error();
      }
      if (typeof pageName !== "string") {
        throw new Error();
      }
      console.log(projectPath);
      const project = getOrCreateProject(projectPath);
      const page = project.resolve(pageName);
      const links = page.getLinks();
      const text = links.flatMap((
        { relate, pages },
      ) => [`${relate}:`, ...pages.map((p) => `\t${p.name}`)]);
      await vim.call("deletebufline", bufnr, 1, "$");
      await vim.call("setbufline", bufnr, 1, text);
    },
  });

  await Promise.resolve();
});
