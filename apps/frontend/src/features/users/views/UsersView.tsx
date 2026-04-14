import React, { useState, useEffect, useMemo } from "react";
import { userService } from "../services/user.service";
import type { User } from "../types/user.types";
import { UserModal } from "../components/UserModal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  UserCircle,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

type FilterMode = "ALL" | "ACTIVE" | "INACTIVE";

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const [userToToggle, setUserToToggle] = useState<User | undefined>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchUsers();
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;
    try {
      if (userToToggle.isActive) {
        await userService.deactivateUser(userToToggle.id);
      } else {
        await userService.activateUser(userToToggle.id);
      }
      setIsConfirmModalOpen(false);
      setUserToToggle(undefined);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  const toggleStatus = (user: User) => {
    setUserToToggle(user);
    setIsConfirmModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (filterMode === "ACTIVE") {
      filtered = filtered.filter((u) => u.isActive);
    } else if (filterMode === "INACTIVE") {
      filtered = filtered.filter((u) => !u.isActive);
    }

    if (search.trim()) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }
    return filtered;
  }, [users, filterMode, search]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] p-4 sm:p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Usuarios</h1>
          <p className="text-gray-500 text-sm">
            Gestiona el acceso y roles de los usuarios del sistema.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 rounded-xl"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => setFilterMode("ALL")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "ALL"
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3 w-3" /> Todos
            </div>
            <UserCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalUsers}</div>
        </button>

        <button
          onClick={() => setFilterMode("ACTIVE")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "ACTIVE"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Activos
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {activeUsers}
          </div>
        </button>

        <button
          onClick={() => setFilterMode("INACTIVE")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "INACTIVE"
              ? "border-rose-500 ring-2 ring-rose-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Inactivos
            </div>
            <div className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {inactiveUsers}
          </div>
        </button>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-5 border border-gray-100 transition-all hover:shadow-md flex flex-col justify-between ${
                !user.isActive ? "opacity-60 bg-gray-50/50" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {user.name}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${user.isActive ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}`}
                  onClick={() => toggleStatus(user)}
                >
                  {user.isActive ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          user={selectedUser}
        />
      )}

      {isConfirmModalOpen && userToToggle && (
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent className="sm:max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {userToToggle.isActive
                  ? "Desactivar Usuario"
                  : "Activar Usuario"}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-2">
                ¿Estás seguro que deseas{" "}
                {userToToggle.isActive ? "desactivar" : "activar"} al usuario{" "}
                <strong>{userToToggle.name}</strong>?
              </p>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setUserToToggle(undefined);
                }}
                className="rounded-xl border-gray-200"
              >
                Cancelar
              </Button>
              <Button
                className={`rounded-xl text-white ${userToToggle.isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                onClick={confirmToggleStatus}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
