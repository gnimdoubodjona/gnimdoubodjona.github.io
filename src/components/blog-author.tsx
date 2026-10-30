import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";

export function BlogAuthor() {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10 border">
        <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
        <AvatarFallback>{DATA.initials}</AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <p className="text-sm font-semibold">{DATA.name}</p>
        <p className="text-xs text-muted-foreground">{DATA.role}</p>
      </div>
    </div>
  );
}

export function BlogTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="glass rounded-full px-3 py-0.5 font-mono text-xs text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
