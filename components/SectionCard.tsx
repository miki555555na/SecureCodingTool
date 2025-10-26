interface SectionCardProps {
  number: number;
  title: string;
  description: string;
  href: string;
}

export default function SectionCard({ number, title, description, href }: SectionCardProps) {
  return (
    <a href={href} className="border p-4 rounded-lg hover:bg-gray-100">
      <h2>{number}. {title}</h2>
      <p>{description}</p>
    </a>
  )
}
