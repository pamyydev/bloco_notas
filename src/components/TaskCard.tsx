import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tasksApi, Task } from "@/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const TaskCard = ({ task }: { task: Task }) => {
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: () => tasksApi.toggle(task.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Status atualizado" });
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

  return (
    <Card className="transition-shadow hover:shadow-[var(--shadow-elegant)] animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-start gap-2">
          {task.completed ? (
            <CheckCircle2 className="text-primary" />
          ) : (
            <Circle className="text-muted-foreground" />
          )}
          <span className="font-display text-xl leading-snug">{task.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {task.description ? (
          <div className="rounded-md bg-accent/40 p-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm leading-relaxed">
              {task.description}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sem descrição</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => toggle.mutate()} disabled={toggle.isPending}>
            {task.completed ? "Reabrir" : "Concluir"}
          </Button>
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1" /> Editar
            </Button>
          </Link>
        </div>
        <Button variant="destructive" size="sm" onClick={() => remove.mutate()} disabled={remove.isPending}>
          <Trash2 className="mr-1" /> Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};
