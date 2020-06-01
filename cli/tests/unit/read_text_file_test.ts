import { unitTest, assert, assertEquals } from "./test_util.ts";
import { resolve, join } from "../../../std/path/mod.ts";

unitTest({ perms: { read: true } }, function readTextFileSyncSuccess(): void {
  const data = Deno.readTextFileSync("cli/tests/fixture.json");
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});

unitTest({ perms: { read: true } }, function readTextFileSyncByUrl(): void {
  const cwd = Deno.cwd().replace(/\\/g, "/");
  const data = Deno.readTextFileSync(
    new URL(`file://${cwd}/cli/tests/fixture.json`)
  );
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});

unitTest({ perms: { read: false } }, function readTextFileSyncPerm(): void {
  let caughtError = false;
  try {
    Deno.readTextFileSync("cli/tests/fixture.json");
  } catch (e) {
    caughtError = true;
    assert(e instanceof Deno.errors.PermissionDenied);
  }
  assert(caughtError);
});

unitTest({ perms: { read: true } }, function readTextFileSyncNotFound(): void {
  let caughtError = false;
  let data;
  try {
    data = Deno.readTextFileSync("bad_filename");
  } catch (e) {
    caughtError = true;
    assert(e instanceof Deno.errors.NotFound);
  }
  assert(caughtError);
  assert(data === undefined);
});

unitTest(
  { perms: { read: true } },
  async function readTextFileSuccess(): Promise<void> {
    const data = await Deno.readTextFile("cli/tests/fixture.json");
    assert(data.length > 0);
    const pkg = JSON.parse(data);
    assertEquals(pkg.name, "deno");
  }
);

unitTest({ perms: { read: true } }, async function readTextFileByUrl(): Promise<
  void
> {
  const fixturePath = resolve(join("cli", "tests", "fixture.json"));
  const data = await Deno.readTextFile(
    new URL(
      Deno.build.os === "windows"
        ? "file:///" + fixturePath.replace(/\\/g, "/")
        : "file://" + fixturePath
    )
  );
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});

unitTest({ perms: { read: false } }, async function readTextFilePerm(): Promise<
  void
> {
  let caughtError = false;
  try {
    await Deno.readTextFile("cli/tests/fixture.json");
  } catch (e) {
    caughtError = true;
    assert(e instanceof Deno.errors.PermissionDenied);
  }
  assert(caughtError);
});

unitTest({ perms: { read: true } }, function readTextFileSyncLoop(): void {
  for (let i = 0; i < 256; i++) {
    Deno.readTextFileSync("cli/tests/fixture.json");
  }
});
