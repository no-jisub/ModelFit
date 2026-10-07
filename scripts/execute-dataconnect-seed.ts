import { spawnSync } from "node:child_process";

const emulatorHost = process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST?.replace(/^https?:\/\//, "");
if (!emulatorHost) {
  console.error(
    "안전을 위해 로컬 SQL Connect 에뮬레이터에서만 가져올 수 있습니다. npm run database:local:test를 사용하세요.",
  );
  process.exit(1);
}

const executable = "npx";
const result = spawnSync(
  executable,
  [
    "-y",
    "firebase-tools@15.28.1",
    "dataconnect:execute",
    "dataconnect/seed_data.gql",
    "ImportCatalog",
  ],
  {
    cwd: process.cwd(),
    env: { ...process.env, FIREBASE_DATA_CONNECT_EMULATOR_HOST: emulatorHost },
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`CSV 카탈로그를 로컬 SQL Connect에 등록했습니다: ${emulatorHost}`);
