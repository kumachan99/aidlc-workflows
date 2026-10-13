// covers: file:aidlc-common/stages/construction/build-and-test.md, file:knowledge/aidlc-quality-agent/testing-guide.md
//
// A browser-required target is Met only on evidence from a real browser
// engine; Node and DOM-emulator journeys are integration evidence (#2489).

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "../harness/fixtures.ts";

const ROOTS = {
  core: join(REPO_ROOT, "core"),
  "dist/claude": join(REPO_ROOT, "dist", "claude", ".claude"),
} as const;

function read(root: string, rel: string): string {
  return readFileSync(join(root, rel), "utf-8").replace(/\s+/g, " ");
}

describe.each(Object.entries(ROOTS))("browser acceptance evidence (%s)", (_name, root) => {
  test("Build and Test makes a browser target Met only on a real browser engine", () => {
    const stage = read(root, "aidlc-common/stages/construction/build-and-test.md");
    expect(stage).toContain(
      "the Evidence cell names where the check ran: Node, a DOM emulator (jsdom, Happy DOM), or a real browser engine",
    );
    expect(stage).toContain("Only a run in a real browser engine makes that target `Met`.");
    expect(stage).toContain(
      "With no real-browser run, including when a browser cannot launch here, the target is `Unverified` unless the person waives real-browser evidence for it",
    );
  });

  test("the testing guide does not count a DOM-emulator journey as end to end", () => {
    const guide = read(root, "knowledge/aidlc-quality-agent/testing-guide.md");
    expect(guide).toContain("A browser workflow is end to end only when it runs in a real browser engine");
    expect(guide).toContain("A journey in Node or a DOM emulator (jsdom, Happy DOM) is an integration test");
  });
});
