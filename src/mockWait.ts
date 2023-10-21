export default function mockWait() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}
