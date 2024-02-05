import { titleFont } from '@/config/font';

export default function Home() {
  return (
    <main>
      <h1>Hello</h1>
      <h1 className={titleFont.className}>Hello world</h1>
    </main>
  );
}
