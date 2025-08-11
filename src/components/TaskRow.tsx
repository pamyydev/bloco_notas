import { tasksApi, Task } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function TaskRow({ task }: { task: Task }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const toggle = useMutation({
    mutationFn: () => tasksApi.toggle(task.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: task.completed ? "Tarefa reaberta" : "Tarefa concluída" });
    },
    onError: (e: any) => toast({ title: "Erro ao atualizar", description: e.message }),
  });

  const remove = useMutation({
    mutationFn: () => tasksApi.remove(task.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Tarefa removida" });
    },
    onError: (e: any) => toast({ title: "Erro ao remover", description: e.message }),
  });

  const snippet = (task.description || "").replace(/\n+/g, " ").slice(0, 140);

  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-accent/30 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggle.mutate()}
        className="mt-1"
        aria-label="Alternar status"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base leading-6 truncate font-medium">
            <button
              className={"text-left w-full " + (task.completed ? "line-through text-muted-foreground" : "")}
              onClick={() => setOpen((o) => !o)}
            >
              {task.title}
            </button>
          </h3>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <Link to={`/tasks/${task.id}/edit`}>
              <Button variant="outline" size="sm"><Pencil className="mr-1" /> Editar</Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => remove.mutate()}>
              <Trash2 className="mr-1" /> Excluir
            </Button>
          </div>
        </div>
        {open && task.description && (
          <div className="mt-2 rounded-md border bg-background p-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none">
              {task.description}
            </ReactMarkdown>
          </div>
        )}
        {!open && snippet && (
          <p className="text-sm text-muted-foreground mt-1 truncate">{snippet}</p>
        )}
      </div>
    </div>
  );
}
