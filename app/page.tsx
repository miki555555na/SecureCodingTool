import SectionCard from "../components/SectionCard";

export default function Home() {
  const sections = [
    { number: 1, title: "タイミング攻撃の基礎", description: "なぜ時間差で情報が漏れるのか", href: "/section1" },
    { number: 2, title: "どうやって時間が漏れるのか", description: "実際の攻撃例・原理", href: "/section2" },
  ];

  return (
    <main className="p-8">
      <h1 className="text-3xl mb-8">タイミング攻撃教育ツール</h1>
      <div className="grid gap-4">
        {sections.map(sec => (
          <SectionCard key={sec.number} {...sec} />
        ))}
      </div>
    </main>
  )
}

