import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi, TaskPayload } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SEO } from "@/components/SEO";
import { toast } from "@/hooks/use-toast";

const MarkdownPreview = ({ value }: { value: string }) => (
  <div className="rounded-md border p-4 bg-accent/30">
    <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none">
      {value || "Prévia da descrição em Markdown…"}
    </ReactMarkdown>
  </div>
);

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: task } = useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksApi.get(Number(id)),
    enabled: isEdit,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCompleted(task.completed);
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: async (payload: TaskPayload) =>
      isEdit ? tasksApi.update(Number(id), payload) : tasksApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: isEdit ? "Tarefa atualizada" : "Tarefa criada" });
      navigate("/");
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message }),
  });

  const titleText = isEdit ? "Editar tarefa" : "Nova tarefa";

  return (
    <main className="container mx-auto py-10">
      <SEO title={`${titleText} — Gerenciador de Tarefas`} description="Edite o título, o status e a descrição em Markdown." />
      <h1 className="font-display text-3xl md:text-4xl mb-6">{titleText}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Estudar Spring Boot" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Markdown)</Label>
            <textarea
              id="description"
              className="w-full rounded-md border bg-background p-3 text-sm min-h-[200px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva sua descrição usando Markdown..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="completed" checked={completed} onCheckedChange={setCompleted} />
            <Label htmlFor="completed">Concluída</Label>
          </div>
          <div className="flex gap-3">
            <Button
              variant="hero"
              onClick={() => mutation.mutate({ title, description, completed })}
              disabled={!title.trim() || mutation.isPending}
            >
              {isEdit ? "Salvar alterações" : "Criar tarefa"}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Prévia</h2>
            <div className="flex items-center gap-2">
              <Switch id="preview" checked={showPreview} onCheckedChange={setShowPreview} />
              <Label htmlFor="preview">Mostrar</Label>
            </div>
          </div>
          {showPreview && <MarkdownPreview value={description} />}
        </div>
      </div>
    </main>
  );
}
