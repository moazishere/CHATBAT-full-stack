import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import avatar from "../assets/avatar.png";
import { useState } from "react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300 bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <span className="hidden lg:block font-semibold tracking-wide">
            Contacts
          </span>
        </div>
        <div className="hidden lg:flex items-center justify-between mt-3 px-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-800 transition-colors">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span>Show online only</span>
          </label>

          <span className="text-xs text-zinc-500 font-medium bg-base-200 px-2 py-0.5 rounded-md">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-sm">
            <Users className="size-6 mb-2" />
            No contacts yet
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full px-3 py-2 lg:px-4 lg:py-3 flex items-center gap-3 transition-all duration-200
                  ${isSelected
                    ? "bg-base-300 ring-1 ring-base-200"
                    : "hover:bg-base-200"
                  }`}
              >
                {/* Avatar */}
                <div className="relative flex shrink-0 mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || avatar}
                    alt={user.fullName}
                    className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full border border-base-300 bg-base-200"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                  )}
                </div>

                {/* Info */}
                <div className="hidden lg:flex flex-col text-left min-w-0">
                  <span
                    className={`font-medium truncate ${isSelected ? "text-primary" : ""
                      }`}
                  >
                    {user.fullName}
                  </span>
                  <span
                    className={`text-sm ${isOnline ? "text-emerald-500" : "text-zinc-400"
                      }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer (optional icons or settings) */}
      <div className="hidden lg:flex items-center justify-center border-t border-base-300 p-3 text-xs text-zinc-500">
        <span>Revica Chat © 2025</span>
      </div>
    </aside>
  );
};

export default Sidebar;
