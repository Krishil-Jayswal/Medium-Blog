export function generateUsername(email: string): string {
  let baseusername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const username = baseusername + Math.floor(Math.random() * 10000);
  return username;
}

const imageCollection = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];
const imageName = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

export function generateProfileImage(): string {
  const idx1 = Math.floor(Math.random() * imageCollection.length);
  const idx2 = Math.floor(Math.random() * imageName.length);
  return `https://api.dicebear.com/6.x/${imageCollection[idx1]}/svg?seed=${imageName[idx2]}`;
}
