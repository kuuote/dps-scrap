type PageRelation = {
  relate: string;
  pages: Page[];
};

const getOrCreate = <T>(map: Map<string, T>, key: string, func: () => T) => {
  const result = map.get(key);
  if (!result) {
    const newValue = func();
    map.set(key, newValue);
    return newValue;
  }
  return result;
};

class Page {
  static comparator = (a: Page, b: Page) =>
    a.mtime === b.mtime ? (a.name < b.name ? -1 : 1) : b.mtime - a.mtime;
  name: string;
  links = new Map<string, Page>();
  fromLinks = new Map<string, Page>();
  mtime = 0;

  constructor(name: string) {
    this.name = name;
  }

  getLinks(): Array<PageRelation> {
    const links = {
      relate: "links",
      pages: Array.from(this.links.values()).sort(Page.comparator),
    };
    const fromLinks = {
      relate: "fromLinks",
      pages: Array.from(this.fromLinks.values()).sort(Page.comparator),
    };
    const twoHop = links.pages.map((
      p,
    ) => ({
      relate: p.name,
      pages: Array.from(p.fromLinks.values()).sort(Page.comparator),
    }));
    const visit = new Map<string, void>();
    // ignore this at link destination
    visit.set(this.name);
    return [links, fromLinks, ...twoHop].map(({ relate, pages }) => ({
      relate,
      pages: pages.filter((p) => {
        if (visit.has(p.name)) {
          return false;
        }
        visit.set(p.name);
        return true;
      }),
    })).filter(({ pages }) => pages.length !== 0);
  }
}

class Project {
  path: string;
  pages = new Map<string, Page>();

  constructor(path: string) {
    this.path = path;
  }

  getOrCreatePage(name: string): Page {
    return getOrCreate(this.pages, name, () => new Page(name));
  }

  readAll() {
    try {
      for (const entry of Deno.readDirSync(this.path)) {
        if (entry.name.endsWith(".scp")) {
          this.resolve(entry.name.slice(0, -4));
        }
      }
    } catch (e) {
      return;
    }
  }

  resolve(name: string): Page {
    const page = this.getOrCreatePage(name);
    try {
      const path = `${this.path}/${name}.scp`;
      const stat = Deno.statSync(path);
      page.mtime = stat.mtime?.getTime() ?? 0;
      // 既存のリンクの削除
      for (const linkedPage of page.links.values()) {
        linkedPage.fromLinks.delete(name);
      }
      // テキストを読んで `[link]` 形式のリンクを抽出し
      const match = (Deno.readTextFileSync(`${this.path}/${name}.scp`).match(
        /\[[^\]]+\]/g,
      ) ?? []).map((l) => l.slice(1, -1));
      // ページを関連付けする
      for (const link of match) {
        const linkToPage = this.getOrCreatePage(link);
        page.links.set(link, linkToPage);
        linkToPage.fromLinks.set(name, page);
      }
    } catch (e) {
      // do nothing
    }
    return page;
  }
}

const projects = new Map<string, Project>();

export const getOrCreateProject = (path: string): Project =>
  getOrCreate(projects, path, () => {
    const project = new Project(path);
    project.readAll();
    return project;
  });
