import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/api/tasks";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Stats() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["stats"], queryFn: tasksApi.stats });

  const items = useMemo(() => {
    const d = data || {};
    // tentativa de mapear chaves comuns
    const total = Number(d.total ?? d.count ?? 0);
    const completed = Number(d.completed ?? d.done ?? 0);
    const pending = Number(d.pending ?? d.open ?? Math.max(total - completed, 0));
    return [
      { name: "Concluídas", value: completed, color: "hsl(var(--primary))" },
      { name: "Pendentes", value: pending, color: "hsl(var(--accent-foreground))" },
    ];
  }, [data]);

  return (
    <main className="container mx-auto py-10">
      <SEO title="Estatísticas — Gerenciador de Tarefas" description="Visão geral de tarefas pendentes e concluídas." />
      <h1 className="font-display text-3xl md:text-4xl mb-6">Estatísticas</h1>
      {isLoading && <p className="text-muted-foreground">Carregando…</p>}
      {isError && <p className="text-destructive">Erro ao carregar estatísticas.</p>}

      {!isLoading && !isError && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Total</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{Number(data?.total ?? data?.count ?? items[0].value + items[1].value)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Concluídas</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{items[0].value}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pendentes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{items[1].value}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader><CardTitle>Distribuição</CardTitle></CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={items} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                    {items.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => String(v)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
