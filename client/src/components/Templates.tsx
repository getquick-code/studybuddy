import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { User, ScheduleTemplate, Exam } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Copy, Globe, Lock, BookOpen, GraduationCap } from "lucide-react";

interface TemplatesProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Templates({ user, open, onOpenChange }: TemplatesProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplatePublic, setNewTemplatePublic] = useState(false);

  const isTeacher = user.role === "teacher";

  const { data: myTemplates = [] } = useQuery<ScheduleTemplate[]>({
    queryKey: ["/api/templates", user.id],
    queryFn: async () => {
      const response = await fetch("/api/templates", { credentials: "include" });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: isTeacher,
  });

  const { data: publicTemplates = [] } = useQuery<(ScheduleTemplate & { userName?: string })[]>({
    queryKey: ["/api/templates/public"],
    queryFn: async () => {
      const response = await fetch("/api/templates/public");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: exams = [] } = useQuery<Exam[]>({
    queryKey: ["/api/exams", user.id],
    queryFn: async () => {
      const response = await fetch(`/api/exams?userId=${user.id}`, { credentials: "include" });
      if (!response.ok) return [];
      return response.json();
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; isPublic: boolean }) => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
          examIds: exams.map((e) => e.id),
        }),
      });
      if (!response.ok) throw new Error("Failed to create template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/templates/public"] });
      setShowCreateForm(false);
      setNewTemplateName("");
      setNewTemplateDescription("");
      setNewTemplatePublic(false);
      toast({ title: t.templates.createSuccess });
    },
    onError: () => {
      toast({ title: "Error creating template", variant: "destructive" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete template");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/templates/public"] });
    },
  });

  const copyTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const today = new Date();
      today.setDate(today.getDate() + 14);
      const response = await fetch(`/api/templates/${templateId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ examDate: today.toISOString().split("T")[0] }),
      });
      if (!response.ok) throw new Error("Failed to copy template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exams", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/subtasks", user.id] });
      toast({ title: t.templates.copySuccess });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Error copying template", variant: "destructive" });
    },
  });

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;
    createTemplateMutation.mutate({
      name: newTemplateName,
      description: newTemplateDescription,
      isPublic: newTemplatePublic,
    });
  };

  const TemplateCard = ({ 
    template, 
    showDelete = false,
    showAuthor = false 
  }: { 
    template: ScheduleTemplate & { userName?: string }; 
    showDelete?: boolean;
    showAuthor?: boolean;
  }) => (
    <Card className="relative" data-testid={`card-template-${template.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {template.isPublic ? (
              <Globe className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-slate-400" />
            )}
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          {showDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => deleteTemplateMutation.mutate(template.id)}
              disabled={deleteTemplateMutation.isPending}
              data-testid={`button-delete-template-${template.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
        {showAuthor && template.userName && (
          <p className="text-xs text-muted-foreground mt-1">
            {t.templates.by} {template.userName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => copyTemplateMutation.mutate(template.id)}
          disabled={copyTemplateMutation.isPending}
          data-testid={`button-use-template-${template.id}`}
        >
          <Copy className="h-4 w-4 mr-2" />
          {t.templates.copyToSchedule}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isTeacher ? (
              <GraduationCap className="h-5 w-5" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
            {t.templates.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={isTeacher ? "my" : "public"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {isTeacher && (
              <TabsTrigger value="my" data-testid="tab-my-templates">
                {t.templates.myTemplates}
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="public" 
              className={isTeacher ? "" : "col-span-2"}
              data-testid="tab-public-templates"
            >
              {t.templates.publicTemplates}
            </TabsTrigger>
          </TabsList>

          {isTeacher && (
            <TabsContent value="my" className="space-y-4">
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full"
                  disabled={exams.length === 0}
                  data-testid="button-create-template"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.templates.createFromSchedule}
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.templates.createTemplate}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t.templates.templateName}</Label>
                      <Input
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder={t.templates.templateName}
                        data-testid="input-template-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.templates.templateDescription}</Label>
                      <Textarea
                        value={newTemplateDescription}
                        onChange={(e) => setNewTemplateDescription(e.target.value)}
                        placeholder={t.templates.templateDescription}
                        rows={2}
                        data-testid="input-template-description"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t.templates.makePublic}
                      </Label>
                      <Switch
                        checked={newTemplatePublic}
                        onCheckedChange={setNewTemplatePublic}
                        data-testid="switch-template-public"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exams.length} {t.templates.examsIncluded}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1"
                        data-testid="button-cancel-template"
                      >
                        {t.common.cancel}
                      </Button>
                      <Button
                        onClick={handleCreateTemplate}
                        disabled={!newTemplateName.trim() || createTemplateMutation.isPending}
                        className="flex-1"
                        data-testid="button-save-template"
                      >
                        {t.common.save}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {myTemplates.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {t.templates.noTemplates}
                    </p>
                  ) : (
                    myTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        showDelete
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          <TabsContent value="public">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {publicTemplates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t.templates.noTemplates}
                  </p>
                ) : (
                  publicTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      showAuthor
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
