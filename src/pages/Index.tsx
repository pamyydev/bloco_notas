import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tasksApi, Task } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskRow } from "@/components/TaskRow";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

const Index = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "done">("all");

  const { data, isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks", { query, status }],
    queryFn: async () => {
      if (status === "pending") return tasksApi.list({ status: false });
      if (status === "done") return tasksApi.list({ status: true });
      if (query.trim()) return tasksApi.search(query.trim());
      return tasksApi.list();
    },
  });

  const title = "Gerenciador de Tarefas — moderno e responsivo";
  const description = "CRUD completo, filtros, busca e Markdown com um design limpo.";

  const tasks = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <SEO title={title} description={description} />
      <header className="border-b border-border/50">
        <section className="container mx-auto py-6">
          <h1 className="text-3xl md:text-4xl font-semibold">Tarefas</h1>
          <p className="text-muted-foreground mt-2">Organize suas tarefas da API com um layout estilo Notion.</p>
        </section>
      </header>

      <main className="container mx-auto pb-12">
        <section className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título (ex: spring)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Link to="/tasks/new"><Button>Nova tarefa</Button></Link>
          </div>
        </section>

        <section>
          <Tabs value={status} onValueChange={(v) => setStatus(v as any)}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="done">Concluídas</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6" />
            <TabsContent value="pending" className="mt-6" />
            <TabsContent value="done" className="mt-6" />
          </Tabs>

          <div className="rounded-xl border bg-card mt-6 divide-y">
            {isLoading && (
              <p className="text-muted-foreground p-4">Carregando…</p>
            )}
            {isError && (
              <p className="text-destructive p-4">Erro ao carregar tarefas.</p>
            )}
            {!isLoading && !isError && tasks.length === 0 && (
              <p className="text-muted-foreground p-4">Nenhuma tarefa encontrada.</p>
            )}
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
