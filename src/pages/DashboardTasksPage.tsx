import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { Plus, ListTodo } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type TaskFilter = "all" | "todo" | "done";

interface TaskItem {
  id: string;
  title: string;
  done: boolean;
}

const MOCK_TASKS: TaskItem[] = [];

export default function DashboardTasksPage() {
  const { t } = useTranslation("navigation");
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const filtered =
    filter === "all"
      ? tasks
      : filter === "done"
        ? tasks.filter((t) => t.done)
        : tasks.filter((t) => !t.done);

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.tasksTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.tasksSubtitle")}
          </p>
        </div>
        <Button variant="default" className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          {t("dashboard.tasksAdd")}
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("dashboard.tasksTitle")}
          </CardTitle>
          <CardDescription>{t("dashboard.tasksSubtitle")}</CardDescription>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as TaskFilter)}
            className="mt-2"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">{t("dashboard.tasksFilterAll")}</TabsTrigger>
              <TabsTrigger value="todo">
                {t("dashboard.tasksFilterTodo")}
              </TabsTrigger>
              <TabsTrigger value="done">
                {t("dashboard.tasksFilterDone")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          {filtered.length > 0 ? (
            <ul className="divide-y divide-border/50">
              {filtered.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    id={task.id}
                    checked={task.done}
                    onCheckedChange={() => handleToggle(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 cursor-pointer text-sm ${
                      task.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("dashboard.tasksEmpty")}
              </p>
              <Button variant="outline" size="sm" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                {t("dashboard.tasksAdd")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
