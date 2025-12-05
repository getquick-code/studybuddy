import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/useLanguage";
import { User } from "@shared/schema";
import { GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleSelectionProps {
  user: User;
  onRoleSelected: () => void;
}

export default function RoleSelection({ user, onRoleSelected }: RoleSelectionProps) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update role");
      return response.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/auth/user"], updatedUser);
      onRoleSelected();
    },
  });

  const selectRole = (role: "student" | "teacher") => {
    updateRoleMutation.mutate(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-primary" data-testid="text-role-title">
            {t.roleSelection.title}
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-role-subtitle">
            {t.roleSelection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => selectRole("student")}
            disabled={updateRoleMutation.isPending}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50"
            data-testid="button-role-student"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {t.roleSelection.student}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.roleSelection.studentDesc}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => selectRole("teacher")}
            disabled={updateRoleMutation.isPending}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50"
            data-testid="button-role-teacher"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <GraduationCap className="w-10 h-10 text-purple-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {t.roleSelection.teacher}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.roleSelection.teacherDesc}
                </p>
              </div>
            </div>
          </button>
        </div>

        {updateRoleMutation.isPending && (
          <div className="text-muted-foreground">
            {t.roleSelection.saving}
          </div>
        )}
      </div>
    </div>
  );
}
