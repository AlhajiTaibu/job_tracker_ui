import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    statusLabel: string;
    dueDate?: string;
    relatedTo?: string;
    category?: string;
  };
  onOpen?: () => void;
};

function formatDate(value?: string) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString();
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-green-700">
            {task.title.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {task.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {task.relatedTo || task.category || "General"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Badge variant="secondary" className="rounded-md">
            {task.statusLabel}
          </Badge>
        </div>

        <p className="mt-6 line-clamp-2 text-sm text-muted-foreground">
          {task.description || "No description"}
        </p>

        <div className="mt-6 flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
          <span>{formatDate(task.dueDate)}</span>
          <button
            type="button"
            onClick={onOpen}
            className="font-medium text-green-700 hover:text-green-800"
          >
            View task
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
