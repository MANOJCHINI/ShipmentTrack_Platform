
import { useState } from "react";
import { useTeam,  useUpdateMemberStatus } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn, initials, timeAgo } from "@/lib/utils";
import { ROLE_LABELS } from "@/types";
import {
  Users,
  UserPlus,
  MoreHorizontal,
  ShieldCheck,
  Mail,
  Ban,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

const statusMeta = {
  active: {
    label: "Active",
    class: "bg-success/10 text-success",
  },
 
  suspended: {
    label: "Suspended",
    class: "bg-destructive/10 text-destructive",
  },
};

export function TeamPage() {
  const { data: members, isLoading } = useTeam();
  
  const updateStatus = useUpdateMemberStatus();
 

  const active = members?.filter((m) => m.status === "active") ?? [];
  
  const suspended = members?.filter((m) => m.status === "suspended") ?? [];

  

  const handleStatusChange = async (id, status) => {
    await updateStatus.mutateAsync({
      id,
      status,
    });
    toast.success(`Member status updated to ${status}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Team & Users"
        description="Manage platform members, roles & permissions"
        icon={Users}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Active Members"
          value={active.length}
          icon={UserCheck}
          iconClass="bg-success/10 text-success"
        />

        <StatCard
          label="Suspended"
          value={suspended.length}
          icon={Ban}
          iconClass="bg-destructive/10 text-destructive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>{members?.length} total members</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : members && members.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    {/* <TableHead className="hidden lg:table-cell">
                      Last active
                    </TableHead> */}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {initials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{m.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {ROLE_LABELS[m.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                            statusMeta[m.status].class,
                          )}
                        >
                          {statusMeta[m.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {m.lastActive === "—" ? "—" : timeAgo(m.lastActive)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {m.status === "active" ? (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  handleStatusChange(m.id, "suspended")
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(m.id, "active")
                                }
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No team members"
              description="Invite people to join your platform."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}