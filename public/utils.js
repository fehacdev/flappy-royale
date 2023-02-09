export default function randomInRange(min, max) {
  return Math.random() * (max - min + 1) + min
}